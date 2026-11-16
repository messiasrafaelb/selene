import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";
import { cycleRepository } from "../repositories/cycleRepository.js";
import { contactRepository } from "../repositories/contactRepository.js";

const BCRYPT_SALT_ROUNDS = 10;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function toPublicUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

export const userService = {
  listAll() {
    return userRepository.findAll().map(toPublicUser);
  },

  getById(id) {
    const user = userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuária não encontrada.", 404);
    }
    return toPublicUser(user);
  },

  create(payload = {}) {
    const name = String(payload.name || "").trim();
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || "");
    const pin = String(payload.pin || "").replace(/\D/g, "");

    if (!name || !email || !password || pin.length !== 4) {
      throw new AppError(
        "Preencha todos os campos e informe um PIN de 4 dígitos.",
        400
      );
    }

    if (!email.includes("@")) {
      throw new AppError("Informe um endereço de e-mail válido.", 400);
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter pelo menos 6 caracteres.", 400);
    }

    const existing = userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Já existe uma conta cadastrada com este e-mail.", 400);
    }

    const hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);

    const created = userRepository.create({
      name,
      email,
      password: hashedPassword,
      pin,
    });

    return toPublicUser(created);
  },

  update(id, payload = {}) {
    const current = userRepository.findById(id);
    if (!current) {
      throw new AppError("Usuária não encontrada.", 404);
    }

    const name = payload.name !== undefined ? String(payload.name).trim() : current.name;
    const email =
      payload.email !== undefined ? normalizeEmail(payload.email) : current.email;
    const pin =
      payload.pin !== undefined
        ? String(payload.pin).replace(/\D/g, "")
        : String(current.pin);

    if (!name || !email || pin.length !== 4) {
      throw new AppError(
        "Preencha todos os campos e informe um PIN de 4 dígitos.",
        400
      );
    }

    if (!email.includes("@")) {
      throw new AppError("Informe um endereço de e-mail válido.", 400);
    }

    const duplicate = userRepository.findByEmail(email);
    if (duplicate && String(duplicate.id) !== String(id)) {
      throw new AppError("Já existe uma conta cadastrada com este e-mail.", 400);
    }

    let password = current.password;
    if (payload.password !== undefined) {
      const rawPassword = String(payload.password);
      if (rawPassword.length < 6) {
        throw new AppError("A senha deve ter pelo menos 6 caracteres.", 400);
      }
      password = bcrypt.hashSync(rawPassword, BCRYPT_SALT_ROUNDS);
    }

    const updated = userRepository.update(id, {
      name,
      email,
      password,
      pin,
    });

    return toPublicUser(updated);
  },

  remove(id) {
    this.getById(id);
    const userCycles = cycleRepository.findByUserId(id);
    userCycles.forEach((cycle) => cycleRepository.remove(cycle.id));

    const userContacts = contactRepository.findByUserId(id);
    userContacts.forEach((contact) => contactRepository.remove(contact.id));

    const removed = userRepository.remove(id);
    return {
      mensagem: "Registro removido com sucesso.",
      removido: toPublicUser(removed),
    };
  },
};
