import { Router } from "express";
import { userRoutes } from "./userRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { cycleRoutes } from "./cycleRoutes.js";
import { contactRoutes } from "./contactRoutes.js";
import { riskAssessmentRoutes } from "./riskAssessmentRoutes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ACADEMIC_DISCLAIMER } from "../services/riskAssessmentService.js";

export const routes = Router();

routes.get("/", (req, res) => {
  return res.status(200).json({
    servico: "API do Projeto Selene — Monitoramento do Ciclo e Apoio Camuflado",
    status: "online",
    arquitetura: "Layered Architecture (Routes -> Controllers -> Services -> Repositories)",
    seguranca: "JWT (Bearer Token) + Bcrypt Password Hashing",
    rotasPublicas: ["GET /", "POST /auth/login", "POST /auth/register", "POST /auth/reset-password"],
    rotasProtegidas: ["/users", "/cycles", "/contacts", "/painel", "/avaliacao-risco"],
    avisoAcademico: ACADEMIC_DISCLAIMER,
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
