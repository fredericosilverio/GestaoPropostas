"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandaRoutes = void 0;
const express_1 = require("express");
const demandaController_1 = require("../controllers/demandaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const demandaRoutes = (0, express_1.Router)();
exports.demandaRoutes = demandaRoutes;
const demandaController = new demandaController_1.DemandaController();
demandaRoutes.use(authMiddleware_1.authMiddleware);
demandaRoutes.get('/', demandaController.list);
demandaRoutes.get('/:id', demandaController.get);
demandaRoutes.post('/', demandaController.create); // Any authenticated user can create? Or just Unit Demandante?
// For now, allow logged in users (mostly Operadores/Demandantes) to create.
// Specific roles can be locked down if needed.
demandaRoutes.put('/:id', demandaController.update);
demandaRoutes.patch('/:id/status', demandaController.changeStatus);
demandaRoutes.post('/:id/initiate-contracting', demandaController.initiateContracting);
demandaRoutes.post('/:id/finalize-contract', demandaController.finalizeContract);
demandaRoutes.delete('/:id', demandaController.delete);
