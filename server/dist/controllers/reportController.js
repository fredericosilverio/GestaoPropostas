"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reportService_1 = require("../services/reportService");
const exportService_1 = require("../services/exportService");
const marketAnalysisReportService_1 = require("../services/marketAnalysisReportService");
const reportService = new reportService_1.ReportService();
const exportService = new exportService_1.ExportService();
const pdfService = new marketAnalysisReportService_1.MarketAnalysisReportService();
class ReportController {
    async getMarketAnalysis(req, res) {
        try {
            const id = Number(req.params.id);
            const report = await reportService.generateMarketAnalysis(id);
            res.json(report);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async downloadPdf(req, res) {
        try {
            console.log('!!! DOWNLOAD PDF V3 CALLED !!!');
            const id = Number(req.params.id);
            const filterType = req.query.filterType || 'all';
            console.log(`PDF Generation - ID: ${id}, Filter: ${filterType}`);
            const pdfBuffer = await pdfService.generateMarketAnalysisReport(id, filterType);
            res.setHeader('X-Report-Version', 'v3-market-analysis');
            res.setHeader('Content-Type', 'application/pdf');
            const now = new Date();
            const timestamp = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') + "_" +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio_analise_${id}_${timestamp}.pdf`);
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error('PDF Export Error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    async downloadExcel(req, res) {
        try {
            const id = Number(req.params.id);
            const buffer = await exportService.generateDemandaExcel(id);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio_analise_${id}.xlsx`);
            res.send(buffer);
        }
        catch (error) {
            console.error('Export Error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ReportController = ReportController;
