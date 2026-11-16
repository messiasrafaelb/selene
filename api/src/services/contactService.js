import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";
import { contactRepository } from "../repositories/contactRepository.js";

export const contactService = {
  validatePayload(payload = {}) {
    if (!payload.userId || !payload.name || !payload.phone) {
      throw new AppError(
        "Informe userId, nome do contato e telefone com DDD.",
        400
      );
    }

    const userExists = userRepository.findById(payload.userId);
    if (!userExists) {
      throw new AppError(
        "A usuária informada em userId não existe na base de dados.",
        400
      );
    }

    const digits = String(payload.phone).replace(/\D/g, "");
    if (digits.length < 10) {
      throw new AppError(
        "Informe um telefone válido com DDD (mínimo de 10 dígitos).",
        400
      );
    }
  },

  list(userId) {
    if (userId !== undefined) {
      return contactRepository.findByUserId(userId);
    }
    return contactRepository.findAll();
  },

  getById(id) {
    const contact = contactRepository.findById(id);
    if (!contact) {
      throw new AppError("Contato de segurança não encontrado.", 404);
    }
    return contact;
  },

  create(payload = {}) {
    this.validatePayload(payload);
    return contactRepository.create({
      userId: Number(payload.userId) || payload.userId,
      name: String(payload.name).trim(),
      relationship: String(payload.relationship || "Rede de Apoio").trim(),
      phone: String(payload.phone).trim(),
      priority: String(payload.priority || "Apoio rápido").trim(),
    });
  },

  update(id, payload = {}) {
    const current = this.getById(id);
    const merged = {
      ...current,
      ...payload,
    };
    this.validatePayload(merged);

    return contactRepository.update(id, {
      userId: Number(merged.userId) || merged.userId,
      name: String(merged.name).trim(),
      relationship: String(merged.relationship || "Rede de Apoio").trim(),
      phone: String(merged.phone).trim(),
      priority: String(merged.priority || "Apoio rápido").trim(),
    });
  },

  remove(id) {
    this.getById(id);
    const removed = contactRepository.remove(id);
    return {
      mensagem: "Registro removido com sucesso.",
      removido: removed,
    };
  },
};
