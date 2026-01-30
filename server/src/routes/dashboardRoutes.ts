import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get('/summary', authMiddleware, dashboardController.getSummary);

export { dashboardRoutes };
