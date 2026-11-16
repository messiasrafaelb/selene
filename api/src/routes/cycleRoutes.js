import { Router } from "express";
import { cycleController } from "../controllers/cycleController.js";

export const cycleRoutes = Router();

cycleRoutes.get("/", cycleController.list);
cycleRoutes.get("/:id", cycleController.getById);
cycleRoutes.post("/", cycleController.create);
cycleRoutes.put("/:id", cycleController.update);
cycleRoutes.delete("/:id", cycleController.remove);
