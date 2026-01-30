import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

const dashboardService = new DashboardService();

export class DashboardController {
    async getSummary(req: Request, res: Response) {
        try {
            const { pca_id } = req.query;
            const summary = await dashboardService.getSummary(pca_id ? Number(pca_id) : undefined);
            res.json(summary);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
