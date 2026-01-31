import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const auditRoutes = Router();
const auditController = new AuditController();

// Only Admins and Managers should see logs? Or maybe just Admins.
// Let's restrict to 'GESTOR' and 'ADMIN' (implied if we had specific roles check).
// For now, authMiddleware.

auditRoutes.get('/', authMiddleware, auditController.list);

export { auditRoutes };
