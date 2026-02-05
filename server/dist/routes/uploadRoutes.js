"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const uploadService_1 = require("../services/uploadService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadRoutes = (0, express_1.Router)();
exports.uploadRoutes = uploadRoutes;
const uploadController = new uploadController_1.UploadController();
// Rota de teste sem autenticação
uploadRoutes.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Upload route is working' });
});
uploadRoutes.use(authMiddleware_1.authMiddleware);
uploadRoutes.post('/', uploadService_1.uploadConfig.single('file'), uploadController.upload);
uploadRoutes.get('/', uploadController.list);
uploadRoutes.get('/demanda/:demandaId', uploadController.listByDemanda);
uploadRoutes.delete('/:id', uploadController.delete);
