import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

const dashboardService = new DashboardService();

export class DashboardController {
    async getSummary(req: Request, res: Response) {
        try {
            const { pca_id, start_date, end_date } = req.query;
            
            const startDate = start_date ? new Date(String(start_date)) : undefined;
            const endDate = end_date ? new Date(String(end_date)) : undefined;

            const summary = await dashboardService.getSummary(
                pca_id ? Number(pca_id) : undefined,
                startDate,
                endDate
            );
            res.json(summary);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
