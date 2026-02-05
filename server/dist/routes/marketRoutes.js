"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.precoRoutes = exports.itemRoutes = void 0;
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
const precoController_1 = require("../controllers/precoController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const itemRoutes = (0, express_1.Router)();
exports.itemRoutes = itemRoutes;
const precoRoutes = (0, express_1.Router)(); // We can separate or nest. 
exports.precoRoutes = precoRoutes;
const itemController = new itemController_1.ItemController();
const precoController = new precoController_1.PrecoController();
// Shared middleware
itemRoutes.use(authMiddleware_1.authMiddleware);
precoRoutes.use(authMiddleware_1.authMiddleware);
// Items
itemRoutes.get('/', itemController.list);
itemRoutes.post('/', itemController.create);
itemRoutes.put('/:id', itemController.update);
itemRoutes.delete('/:id', itemController.delete);
// Prices
precoRoutes.post('/batch-entry', (req, res, next) => {
    console.log(`[DEBUG] POST /precos/batch-entry hit`);
    next();
}, precoController.createBatch);
precoRoutes.get('/', precoController.list);
precoRoutes.post('/', precoController.create);
precoRoutes.put('/:id', precoController.update);
precoRoutes.delete('/:id', precoController.delete);
