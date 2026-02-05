"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRoutes = void 0;
const express_1 = require("express");
const auditController_1 = require("../controllers/auditController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const auditRoutes = (0, express_1.Router)();
exports.auditRoutes = auditRoutes;
const auditController = new auditController_1.AuditController();
// Only Admins and Managers should see logs? Or maybe just Admins.
// Let's restrict to 'GESTOR' and 'ADMIN' (implied if we had specific roles check).
// For now, authMiddleware.
auditRoutes.get('/', authMiddleware_1.authMiddleware, auditController.list);
