"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogoController = void 0;
const catalogoService_1 = require("../services/catalogoService");
const catalogoService = new catalogoService_1.CatalogoService();
class CatalogoController {
    async list(req, res) {
        try {
            const { categoria, search, ativo } = req.query;
            const items = await catalogoService.list({
                categoria: categoria,
                search: search,
                ativo: ativo === 'false' ? false : ativo === 'true' ? true : undefined
            });
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const item = await catalogoService.findById(Number(req.params.id));
            if (!item) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const item = await catalogoService.create(req.body);
            res.status(201).json(item);
        }
        catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Código já existe no catálogo' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const item = await catalogoService.update(Number(req.params.id), req.body);
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await catalogoService.deactivate(Number(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async importToItem(req, res) {
        try {
            const { catalogoId, demandaId, quantidade, codigoItem } = req.body;
            const item = await catalogoService.importToItem(Number(catalogoId), Number(demandaId), Number(quantidade), Number(codigoItem));
            res.status(201).json(item);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async listCategorias(req, res) {
        try {
            const categorias = await catalogoService.listCategorias();
            res.json(categorias);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.CatalogoController = CatalogoController;
