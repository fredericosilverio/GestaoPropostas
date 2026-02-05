"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FornecedorController = void 0;
const fornecedorService_1 = require("../services/fornecedorService");
const fornecedorService = new fornecedorService_1.FornecedorService();
class FornecedorController {
    async list(req, res) {
        try {
            const filters = {
                search: req.query.search,
                ativo: req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined
            };
            const fornecedores = await fornecedorService.list(filters);
            res.json(fornecedores);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async get(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const fornecedor = await fornecedorService.findById(id);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            res.json(fornecedor);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const fornecedor = await fornecedorService.create(req.body);
            res.status(201).json(fornecedor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const fornecedor = await fornecedorService.update(id, req.body);
            res.json(fornecedor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await fornecedorService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async toggleStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const fornecedor = await fornecedorService.toggleStatus(id);
            res.json(fornecedor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.FornecedorController = FornecedorController;
