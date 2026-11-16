import { riskAssessmentService } from "../services/riskAssessmentService.js";

export const riskAssessmentController = {
  evaluateRisk(req, res) {
    const result = riskAssessmentService.evaluateAndPersist(req.body);
    return res.status(200).json(result);
  },

  getDashboard(req, res) {
    const userId = req.params.userId ?? req.query.userId;
    const dashboard = riskAssessmentService.buildDashboard(userId);
    return res.status(200).json(dashboard);
  },
};
