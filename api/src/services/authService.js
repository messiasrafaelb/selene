import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/authConfig.js";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";
import { userService, toPublicUser } from "./userService.js";

const BCRYPT_SALT_ROUNDS = 10;

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.expiresIn,
    }
  );
}

export const authService = {
  login({ email = "", password = "" } = {}) {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new AppError("Informe seu e-mail e sua senha.", 400);
    }

    const user = userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const passwordMatches = bcrypt.compareSync(
      String(password),
      String(user.password)
    );
    if (!passwordMatches) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const publicUser = toPublicUser(user);
    const token = generateAccessToken(publicUser);

    return {
      ...publicUser,
      user: publicUser,
      token,
    };
  },

  register(payload = {}) {
    const createdUser = userService.create(payload);
    const token = generateAccessToken(createdUser);

    return {
      ...createdUser,
      user: createdUser,
      token,
    };
  },

  resetPasswordWithPin({ email = "", pin = "", newPassword = "" } = {}) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const cleanPin = String(pin || "").replace(/\D/g, "");

    if (!normalizedEmail || cleanPin.length !== 4 || !newPassword) {
      throw new AppError(
        "Informe o e-mail, o PIN de 4 dígitos e a nova senha.",
        400
      );
    }

    if (String(newPassword).length < 6) {
      throw new AppError("A nova senha deve ter pelo menos 6 caracteres.", 400);
    }

    const user = userRepository.findByEmail(normalizedEmail);
    if (!user || String(user.pin) !== cleanPin) {
      throw new AppError("E-mail ou PIN de segurança inválidos.", 400);
    }

    const hashedPassword = bcrypt.hashSync(String(newPassword), BCRYPT_SALT_ROUNDS);
    userRepository.update(user.id, { password: hashedPassword });

    return {
      ok: true,
      mensagem: "Senha redefinida com sucesso! Você já pode entrar.",
    };
  },
};
