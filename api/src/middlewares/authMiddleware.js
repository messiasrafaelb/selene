import jwt from "jsonwebtoken";
import { authConfig } from "../config/authConfig.js";
import { AppError } from "../errors/AppError.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token de autenticação não informado.", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (!/^Bearer$/i.test(scheme) || !token) {
    throw new AppError("Formato de token inválido. Use: Bearer <token>.", 401);
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    return next();
  } catch (err) {
    throw new AppError("Token de autenticação inválido ou expirado.", 401);
  }
}
