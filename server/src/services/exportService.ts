import ExcelJS from 'exceljs';
import { ReportService } from './reportService';

const reportService = new ReportService();

export class ExportService {
    async generateDemandaExcel(demandaId: number) {
        const report = await reportService.generateMarketAnalysis(demandaId);

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Gestão de Propostas';
        workbook.created = new Date();

        // SHEET 1: RESUMO
        const sheetResumo = workbook.addWorksheet('Resumo');

        sheetResumo.mergeCells('A1:B1');
        sheetResumo.getCell('A1').value = 'RELATÓRIO DE ANÁLISE DE MERCADO';
        sheetResumo.getCell('A1').font = { bold: true, size: 14 };

        sheetResumo.addRow(['Demanda:', report.demanda.codigo]);
        sheetResumo.addRow(['Objeto:', report.demanda.descricao]);
        sheetResumo.addRow(['Unidade:', report.demanda.unidade_demandante]);
        sheetResumo.addRow(['Responsável:', report.demanda.responsavel]);
        sheetResumo.addRow(['PCA:', report.demanda.pca]);
        sheetResumo.addRow(['Data Emissão:', report.data_emissao]);
        sheetResumo.addRow(['']);

        sheetResumo.addRow(['RESUMO FINANCEIRO']);
        sheetResumo.getRow(9).font = { bold: true };
        sheetResumo.addRow(['Total de Itens:', report.resumo.total_itens]);
        sheetResumo.addRow(['Valor Total Estimado:', report.resumo.valor_total_estimado]);

        sheetResumo.getColumn(1).width = 20;
        sheetResumo.getColumn(2).width = 50;

        // SHEET 2: ITENS E PREÇOS
        const sheetItens = workbook.addWorksheet('Detalhamento');

        sheetItens.columns = [
            { header: 'Item', key: 'item', width: 10 },
            { header: 'Descrição', key: 'descricao', width: 40 },
            { header: 'Unid.', key: 'unidade', width: 10 },
            { header: 'Qtd.', key: 'quantidade', width: 10 },
            { header: 'Média', key: 'media', width: 15 },
            { header: 'Mediana (Est.)', key: 'mediana', width: 15 },
            { header: 'Desvio Padrão', key: 'desvio', width: 15 },
            { header: 'CV (%)', key: 'cv', width: 10 },
            { header: 'Valor Total', key: 'total', width: 15 },
            { header: 'Preço 1', key: 'p1', width: 15 },
            { header: 'Preço 2', key: 'p2', width: 15 },
            { header: 'Preço 3', key: 'p3', width: 15 },
            { header: 'Preço 4', key: 'p4', width: 15 },
            { header: 'Preço 5', key: 'p5', width: 15 },
        ];

        // Header Style
        sheetItens.getRow(1).font = { bold: true };

        report.itens.forEach((item: any) => {
            const row: any = {
                item: item.codigo_item,
                descricao: item.descricao,
                unidade: item.unidade_medida,
                quantidade: item.quantidade,
                media: item.estatisticas.media,
                mediana: item.estatisticas.mediana,
                desvio: item.estatisticas.desvioPadrao,
                cv: item.estatisticas.cv,
                total: item.valor_estimado_final
            };

            // Add individual prices horizontally
            item.precos.forEach((p: any, index: number) => {
                const key = `p${index + 1}`;
                if (index < 5) {
                    row[key] = p.valor_unitario;
                }
            });

            sheetItens.addRow(row);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
}
