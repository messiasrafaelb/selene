import { authService } from "../services/authService.js";

export const authController = {
  login(req, res) {
    const user = authService.login(req.body);
    return res.status(200).json(user);
  },

  register(req, res) {
    const user = authService.register(req.body);
    return res.status(201).json(user);
  },

  resetPassword(req, res) {
    const result = authService.resetPasswordWithPin(req.body);
    return res.status(200).json(result);
  },
};
