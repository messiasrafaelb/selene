import { Router } from "express";
import { userRoutes } from "./userRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { cycleRoutes } from "./cycleRoutes.js";
import { contactRoutes } from "./contactRoutes.js";
import { riskAssessmentRoutes } from "./riskAssessmentRoutes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ACADEMIC_DISCLAIMER } from "../services/riskAssessmentService.js";
import { userRepository } from "../repositories/userRepository.js";
import { cycleRepository } from "../repositories/cycleRepository.js";
import { contactRepository } from "../repositories/contactRepository.js";
import { toPublicUser } from "../services/userService.js";

export const routes = Router();

routes.get("/", (req, res) => {
  return res.status(200).json({
    servico: "API do Projeto Selene — Monitoramento do Ciclo e Apoio Camuflado",
    status: "online",
    bancoDeDados: "SQLite Relacional (node:sqlite -> selene.sqlite)",
    arquitetura: "Layered Architecture (Routes -> Controllers -> Services -> Repositories -> SQLite)",
    seguranca: "JWT (Bearer Token) + Bcrypt Password Hashing",
    rotasPublicas: ["GET /", "GET /database", "POST /auth/login", "POST /auth/register", "POST /auth/reset-password"],
    rotasProtegidas: ["/users", "/cycles", "/contacts", "/painel", "/avaliacao-risco"],
    avisoAcademico: ACADEMIC_DISCLAIMER,
  });
});

routes.get("/database", (req, res) => {
  return res.status(200).json({
    engine: "SQLite 3 (api/src/database/data/selene.sqlite)",
    tabelas: {
      users: userRepository.findAll().map(toPublicUser),
      cycles: cycleRepository.findAll(),
      contacts: contactRepository.findAll(),
    },
  });
});

routes.use("/auth", authRoutes);
routes.use("/users", authMiddleware, userRoutes);
routes.use("/usuarios", authMiddleware, userRoutes);
routes.use("/cycles", authMiddleware, cycleRoutes);
routes.use("/ciclos", authMiddleware, cycleRoutes);
routes.use("/contacts", authMiddleware, contactRoutes);
routes.use("/contatos", authMiddleware, contactRoutes);
routes.use("/", authMiddleware, riskAssessmentRoutes);
