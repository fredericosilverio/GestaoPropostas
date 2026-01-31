import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { ExportService } from '../services/exportService';
import { PdfService } from '../services/pdfService';

const reportService = new ReportService();
const exportService = new ExportService();
const pdfService = new PdfService();

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
            const id = Number(req.params.id);
            const pdfBuffer = await pdfService.generateMarketAnalysisReport(id);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=relatorio_analise_${id}.pdf`);
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
}
