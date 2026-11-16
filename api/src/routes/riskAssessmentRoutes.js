import { Router } from "express";
import { riskAssessmentController } from "../controllers/riskAssessmentController.js";

export const riskAssessmentRoutes = Router();

riskAssessmentRoutes.get("/painel", riskAssessmentController.getDashboard);
riskAssessmentRoutes.get("/painel/:userId", riskAssessmentController.getDashboard);
riskAssessmentRoutes.post("/avaliacao-risco", riskAssessmentController.evaluateRisk);
