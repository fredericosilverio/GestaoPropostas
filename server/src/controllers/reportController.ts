import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { ExportService } from '../services/exportService';
import { MarketAnalysisReportService } from '../services/marketAnalysisReportService';
import { BudgetDistributionReportService } from '../services/budgetDistributionReportService';

const reportService = new ReportService();
const exportService = new ExportService();
const pdfService = new MarketAnalysisReportService();
const budgetService = new BudgetDistributionReportService();

export class ReportController {
    async getMarketAnalysis(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const report = await reportService.generateMarketAnalysis(id);
            res.json(report);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async downloadPdf(req: Request, res: Response) {
        try {
            console.log('!!! DOWNLOAD PDF V3 CALLED !!!');
            const id = Number(req.params.id);
            const filterType = (req.query.filterType as string) || 'all';

            console.log(`PDF Generation - ID: ${id}, Filter: ${filterType}`);

            const pdfBuffer = await pdfService.generateMarketAnalysisReport(id, filterType as 'all' | 'median25' | 'median25fallback');

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
        } catch (error: any) {
            console.error('PDF Export Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async downloadExcel(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const buffer = await exportService.generateDemandaExcel(id);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio_analise_${id}.xlsx`);
            res.send(buffer);
        } catch (error: any) {
            console.error('Export Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async downloadBudgetDistributionPdf(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const filterType = (req.query.filterType as string) || 'median25fallback';

            console.log(`Budget Distribution PDF - ID: ${id}, Filter: ${filterType}`);

            const pdfBuffer = await budgetService.generateReport(id, filterType as 'all' | 'median25' | 'median25fallback');

            res.setHeader('Content-Type', 'application/pdf');
            const now = new Date();
            const timestamp = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') + "_" +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');

            res.setHeader('Content-Disposition', `attachment; filename=distribuicao_orcamentaria_${id}_${timestamp}.pdf`);
            res.send(pdfBuffer);
        } catch (error: any) {
            console.error('Budget Distribution PDF Error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
