import { Router } from "express";
import { contactController } from "../controllers/contactController.js";

export const contactRoutes = Router();

contactRoutes.get("/", contactController.list);
contactRoutes.get("/:id", contactController.getById);
contactRoutes.post("/", contactController.create);
contactRoutes.put("/:id", contactController.update);
contactRoutes.delete("/:id", contactController.remove);
