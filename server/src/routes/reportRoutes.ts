import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authMiddleware } from '../middlewares/authMiddleware';

const reportRoutes = Router();
const reportController = new ReportController();

reportRoutes.get('/market-analysis/:id', authMiddleware, reportController.getMarketAnalysis);
reportRoutes.get('/market-analysis/:id/pdf', authMiddleware, reportController.downloadPdf);
reportRoutes.get('/market-analysis/:id/export', authMiddleware, reportController.downloadExcel);
reportRoutes.get('/budget-distribution/:id/pdf', authMiddleware, reportController.downloadBudgetDistributionPdf);

export { reportRoutes };
