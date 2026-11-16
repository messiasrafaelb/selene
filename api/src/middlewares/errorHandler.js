import { AppError } from "../errors/AppError.js";

export function notFoundHandler(req, res) {
  return res.status(404).json({
    erro: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
  });
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: err.message,
    });
  }

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      erro: "JSON malformado no corpo da requisição.",
    });
  }

  return res.status(500).json({
    erro: "Erro interno do servidor.",
  });
}
