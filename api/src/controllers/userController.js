import { userService } from "../services/userService.js";

export const userController = {
  list(req, res) {
    const users = userService.listAll();
    return res.status(200).json(users);
  },

  getById(req, res) {
    const user = userService.getById(req.params.id);
    return res.status(200).json(user);
  },

  create(req, res) {
    const created = userService.create(req.body);
    return res.status(201).json(created);
  },

  update(req, res) {
    const updated = userService.update(req.params.id, req.body);
    return res.status(200).json(updated);
  },

  remove(req, res) {
    const result = userService.remove(req.params.id);
    return res.status(200).json(result);
  },
};
