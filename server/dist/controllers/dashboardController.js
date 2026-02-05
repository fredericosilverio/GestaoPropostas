"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
const dashboardService = new dashboardService_1.DashboardService();
class DashboardController {
    async getSummary(req, res) {
        try {
            const { pca_id } = req.query;
            const summary = await dashboardService.getSummary(pca_id ? Number(pca_id) : undefined);
            res.json(summary);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.DashboardController = DashboardController;
