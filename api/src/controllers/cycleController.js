import { cycleService } from "../services/cycleService.js";

export const cycleController = {
  list(req, res) {
    const cycles = cycleService.list(req.query.userId);
    return res.status(200).json(cycles);
  },

  getById(req, res) {
    const cycle = cycleService.getById(req.params.id);
    return res.status(200).json(cycle);
  },

  create(req, res) {
    const created = cycleService.create(req.body);
    return res.status(201).json(created);
  },

  update(req, res) {
    const updated = cycleService.update(req.params.id, req.body);
    return res.status(200).json(updated);
  },

  remove(req, res) {
    const result = cycleService.remove(req.params.id);
    return res.status(200).json(result);
  },
};
