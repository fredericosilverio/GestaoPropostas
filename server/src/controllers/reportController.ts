import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

const reportService = new ReportService();

export class ReportController {
    async getMarketAnalysis(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const reportData = await reportService.generateMarketAnalysis(Number(id));
            res.json(reportData);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
