import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { MarketAnalysisService } from './marketAnalysisService';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const marketAnalysisService = new MarketAnalysisService();

interface BudgetReportOptions {
    logoPath?: string;
    orgaoNome?: string;
}

export class BudgetDistributionReportService {
    private options: BudgetReportOptions;

    constructor(options: BudgetReportOptions = {}) {
        this.options = {
            logoPath: options.logoPath || '',
            orgaoNome: options.orgaoNome || 'Estado de Goiás'
        };
    }

    async generateReport(demandaId: number, filterType: 'all' | 'median25' | 'median25fallback' = 'median25fallback'): Promise<Buffer> {
        // Fetch Demanda with all relations including natureza_despesa
        const demanda = await prisma.demanda.findUnique({
            where: { id: demandaId },
            include: {
                responsavel: { select: { nome_completo: true, email: true, matricula: true } },
                pca: true,
                itens: {
                    include: {
                        precos: {
                            where: { ativo: true },
                            orderBy: { valor_unitario: 'asc' }
                        },
                        natureza_despesa: true
                    },
                    orderBy: { codigo_item: 'asc' }
                }
            }
        }) as any;

        if (!demanda) {
            throw new Error('Demanda não encontrada');
        }

        // Calculate values using same logic as market analysis report
        const itensComValores = demanda.itens.map((item: any) => {
            const baseStats = marketAnalysisService.calculateStatistics(item.precos);
            const classifiedPrices = marketAnalysisService.classifyPrices(item.precos, baseStats.mediana);

            let precosParaCalculo = classifiedPrices;

            if (filterType === 'median25' || filterType === 'median25fallback') {
                let precosAceitos = classifiedPrices.filter((p: any) => p.classificacao === 'ACEITO');
                if (precosAceitos.length > 0) {
                    precosParaCalculo = precosAceitos;
                } else if (filterType === 'median25fallback') {
                    precosParaCalculo = classifiedPrices;
                } else {
                    precosParaCalculo = [];
                }
            }

            const finalStats = marketAnalysisService.calculateStatistics(precosParaCalculo);
            const valorUnitario = finalStats.media ? Number(finalStats.media.toFixed(2)) : 0;
            const valorTotal = Number((valorUnitario * Number(item.quantidade)).toFixed(2));

            const pct1grau = Number(item.percentual_1grau || 0);
            const pct2grau = Number(item.percentual_2grau || 0);
            const pctAreaMeio = Number(item.percentual_area_meio || 0);

            return {
                ...item,
                valor_unitario_calculado: valorUnitario,
                valor_total_calculado: valorTotal,
                natureza_codigo: item.elemento_despesa,
                natureza_descricao: (item as any).natureza_despesa?.descricao || item.descricao,
                pct_1grau: pct1grau,
                pct_2grau: pct2grau,
                pct_area_meio: pctAreaMeio,
                valor_1grau: Number((valorTotal * pct1grau / 100).toFixed(2)),
                valor_2grau: Number((valorTotal * pct2grau / 100).toFixed(2)),
                valor_area_meio: Number((valorTotal * pctAreaMeio / 100).toFixed(2)),
                tipo_despesa_label: item.tipo_despesa || (item as any).natureza_despesa?.tipo || '',
                forma_pagamento_label: item.forma_pagamento || ''
            };
        });

        // Group by natureza_despesa for second table
        const naturezaGroupMap = new Map<string, any>();
        itensComValores.forEach((item: any) => {
            const key = item.natureza_descricao;
            if (!naturezaGroupMap.has(key)) {
                naturezaGroupMap.set(key, {
                    descricao: key,
                    valor_total: 0,
                    natureza_codigo: item.natureza_codigo,
                    pct_1grau: item.pct_1grau,
                    pct_2grau: item.pct_2grau,
                    pct_area_meio: item.pct_area_meio,
                    valor_1grau: 0,
                    valor_2grau: 0,
                    valor_area_meio: 0,
                    tipo_despesa: item.tipo_despesa_label,
                    forma_pagamento: item.forma_pagamento_label,
                    itens: []
                });
            }
            const group = naturezaGroupMap.get(key)!;
            group.valor_total += item.valor_total_calculado;
            group.valor_1grau += item.valor_1grau;
            group.valor_2grau += item.valor_2grau;
            group.valor_area_meio += item.valor_area_meio;
            group.itens.push(item);
        });

        const naturezaGroups = Array.from(naturezaGroupMap.values());

        // Load logo
        let logoBase64 = '';
        const possiblePaths = [
            path.resolve(process.cwd(), 'uploads', 'logo-tjgo.png'),
            path.resolve(__dirname, '../../uploads', 'logo-tjgo.png'),
            path.resolve(__dirname, '../../../uploads', 'logo-tjgo.png'),
            path.join('/app/uploads', 'logo-tjgo.png')
        ];

        let logoPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                logoPath = p;
                break;
            }
        }

        if (logoPath) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }

        // Generate HTML
        const html = this.generateHtml(demanda, itensComValores, naturezaGroups, logoBase64);

        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            margin: { top: '48mm', bottom: '15mm', left: '10mm', right: '10mm' },
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `
                <style>
                    .header-table {
                        width: 100%;
                        margin: 0 10mm;
                        margin-top: 8mm;
                        border-collapse: collapse;
                        table-layout: fixed;
                        font-family: 'Times New Roman', Georgia, serif;
                        line-height: 1.1;
                    }
                    .header-table td {
                        border: 1px solid #ccc;
                        vertical-align: middle;
                        text-align: center;
                        padding: 3pt;
                    }
                    .header-logo-cell { width: 25%; padding: 5pt !important; }
                    .header-logo-cell img { width: 150px; height: auto; margin-bottom: 2pt; }
                    .header-logo-cell .coord-nome { font-size: 6.5pt; display: block; margin-top: 0; font-weight: normal; color: #333; }
                    .header-title-main { font-size: 11pt; font-weight: bold; text-transform: uppercase; padding: 6pt !important; }
                    .header-subtitle { font-size: 9pt; font-weight: bold; background: #fcfcfc; padding: 2pt !important; }
                    .header-meta-grid { padding: 0 !important; }
                    .header-meta-table { width: 100%; border-collapse: collapse; border: none; }
                    .header-meta-table td { border: none; border-right: 1px solid #ccc; font-size: 8pt; padding: 2pt !important; }
                    .header-meta-table td:last-child { border-right: none; }
                    .header-meta-table .label { font-weight: bold; }
                </style>
                <table class="header-table">
                    <tr>
                        <td rowspan="3" class="header-logo-cell">
                            ${logoBase64 ? `<img src="${logoBase64}" alt="Brasão"/>` : ''}
                            <span class="coord-nome">Coordenadoria de Contratos e Aquisições de TIC</span>
                        </td>
                        <td class="header-title-main">Distribuição Orçamentária<br/><span style="font-size: 8pt; font-weight: normal;">(Resolução nº 195/2014 do CNJ)</span></td>
                    </tr>
                    <tr>
                        <td class="header-subtitle">Processo de Planejamento de Aquisições e de Contratações de Soluções de TIC</td>
                    </tr>
                    <tr>
                        <td class="header-meta-grid">
                            <table class="header-meta-table">
                                <tr>
                                    <td><span class="label">Revisão:</span> 008</td>
                                    <td><span class="label">Código/Versão:</span> CCA-006</td>
                                    <td style="width: 25%;"><span class="label">Página:</span> <span class="pageNumber"></span>/<span class="totalPages"></span></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `,
            footerTemplate: `
                <div style="width: 100%; font-size: 9px; text-align: center; color: #666; padding: 5px;">
                    <span>Distribuição Orçamentária - ${demanda.codigo_demanda}</span>
                </div>
            `
        });

        await browser.close();
        return Buffer.from(pdf);
    }

    private formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    private generateHtml(demanda: any, itens: any[], naturezaGroups: any[], logoBase64: string): string {
        const fmt = (v: number) => this.formatCurrency(v);

        const valorTotal = itens.reduce((acc, item) => acc + item.valor_total_calculado, 0);
        const totalValor1grau = itens.reduce((acc, item) => acc + item.valor_1grau, 0);
        const totalValor2grau = itens.reduce((acc, item) => acc + item.valor_2grau, 0);
        const totalValorAreaMeio = itens.reduce((acc, item) => acc + item.valor_area_meio, 0);

        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Distribuição Orçamentária</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Georgia, serif;
            font-size: 9pt;
            line-height: 1.2;
            color: #1a1a1a;
            background: #fff;
        }

        .content { padding: 0 5px; }

        .section-title {
            font-size: 11pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 10pt;
            padding: 4pt;
            border: 1px solid #999;
            background: #d6e4f0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        /* Data Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin-bottom: 12pt;
        }

        .data-table th {
            background: #d0d0d0;
            font-weight: bold;
            font-size: 7.5pt;
            padding: 3pt 4pt;
            border: 0.5px solid #999;
            text-align: center;
            vertical-align: middle;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        .data-table td {
            padding: 2pt 4pt;
            border: 0.5px solid #999;
            vertical-align: middle;
        }

        .data-table .currency {
            text-align: right;
            white-space: nowrap;
            font-size: 8pt;
        }

        .data-table .center { text-align: center; }
        .data-table .right { text-align: right; }

        .data-table .total-row {
            font-weight: bold;
            background: #e0e0e0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        .data-table .total-row td {
            padding: 4pt;
            font-size: 8.5pt;
            border-top: 0.5px solid #999;
            border-bottom: 0.5px solid #999;
            border-left: 0.5px solid transparent;
            border-right: 0.5px solid transparent;
        }

        .data-table .total-row td:first-child {
            border-left: 0.5px solid #999;
        }

        .data-table .total-row td:last-child {
            border-right: 0.5px solid #999;
        }

        .pct-cell {
            text-align: center;
            background: #e0e0e0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        /* Header groups */
        .header-group {
            background: #e0e0e0 !important;
            font-size: 8pt;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        /* Methodology */
        .methodology {
            margin-top: 15pt;
            font-size: 9pt;
            line-height: 1.05;
        }

        .methodology h4 {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 4pt;
        }

        .methodology p {
            text-align: justify;
            margin-bottom: 6pt;
        }

        .section-gap {
            margin-top: 20pt;
        }
    </style>
</head>
<body>
    <div class="content">
        <!-- TABLE 1: Objeto -->
        <div class="section-title">DISTRIBUIÇÃO ORÇAMENTÁRIA</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th colspan="6" style="background: #e0e0e0; font-size: 8.5pt;">Objeto</th>
                    <th colspan="6" class="header-group">Orçamento por Item e Grau de Jurisdição</th>
                    <th rowspan="2" style="width: 6%;">Tipo de<br/>Despesa</th>
                    <th rowspan="2" style="width: 6%;">Forma de<br/>Pagamento</th>
                </tr>
                <tr>
                    <th style="width: 3%;">Item</th>
                    <th style="width: 18%;">Descrição</th>
                    <th style="width: 3%;">Qtde</th>
                    <th style="width: 8%;">Valor Unitário</th>
                    <th style="width: 9%;">Valor Total</th>
                    <th style="width: 5%;">Natureza</th>
                    <th colspan="2" style="width: 12%;">1º Grau</th>
                    <th colspan="2" style="width: 12%;">2º Grau</th>
                    <th colspan="2" style="width: 12%;">Área Meio</th>
                </tr>
            </thead>
            <tbody>
                ${itens.map((item, idx) => `
                <tr>
                    <td class="center">${idx + 1}</td>
                    <td style="text-align: justify; font-size: 7.5pt;">${item.descricao}</td>
                    <td class="center">${Number(item.quantidade).toLocaleString('pt-BR')}</td>
                    <td class="currency">R$ ${fmt(item.valor_unitario_calculado)}</td>
                    <td class="currency">R$ ${fmt(item.valor_total_calculado)}</td>
                    <td class="center" style="font-size: 7pt;">${item.natureza_codigo}</td>
                    <td class="pct-cell">${item.pct_1grau}%</td>
                    <td class="currency">R$ ${fmt(item.valor_1grau)}</td>
                    <td class="pct-cell">${item.pct_2grau}%</td>
                    <td class="currency">R$ ${fmt(item.valor_2grau)}</td>
                    <td class="pct-cell">${item.pct_area_meio}%</td>
                    <td class="currency">R$ ${fmt(item.valor_area_meio)}</td>
                    <td class="center" style="font-size: 7.5pt;">${item.tipo_despesa_label}</td>
                    <td class="center" style="font-size: 7.5pt;">${item.forma_pagamento_label}</td>
                </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="4" class="right">VALOR TOTAL =</td>
                    <td class="currency">R$ ${fmt(valorTotal)}</td>
                    <td></td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValor1grau)}</td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValor2grau)}</td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValorAreaMeio)}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <!-- TABLE 2: Orçamento por Natureza de Despesa -->
        <div class="section-gap"></div>

        <table class="data-table">
            <thead>
                <tr>
                    <th colspan="4" style="background: #e0e0e0; font-size: 8.5pt;">Objeto</th>
                    <th colspan="6" class="header-group">Orçamento Por Natureza de Despesa e Grau de Jurisdição</th>
                    <th rowspan="2" style="width: 6%;">Tipo de<br/>Despesa</th>
                    <th rowspan="2" style="width: 6%;">Forma de<br/>Pagamento</th>
                </tr>
                <tr>
                    <th style="width: 3%;">Item</th>
                    <th style="width: 20%;">Descrição da Natureza de Despesa</th>
                    <th style="width: 9%;">Valor Total</th>
                    <th style="width: 5%;">Natureza</th>
                    <th colspan="2" style="width: 12%;">1º Grau</th>
                    <th colspan="2" style="width: 12%;">2º Grau</th>
                    <th colspan="2" style="width: 12%;">Área Meio</th>
                </tr>
            </thead>
            <tbody>
                ${naturezaGroups.map((group, idx) => `
                <tr>
                    <td class="center">${idx + 1}</td>
                    <td style="text-align: justify; font-size: 7.5pt;">${group.descricao}</td>
                    <td class="currency">R$ ${fmt(group.valor_total)}</td>
                    <td class="center" style="font-size: 7pt;">${group.natureza_codigo}</td>
                    <td class="pct-cell">${group.pct_1grau}%</td>
                    <td class="currency">R$ ${fmt(group.valor_1grau)}</td>
                    <td class="pct-cell">${group.pct_2grau}%</td>
                    <td class="currency">R$ ${fmt(group.valor_2grau)}</td>
                    <td class="pct-cell">${group.pct_area_meio}%</td>
                    <td class="currency">R$ ${fmt(group.valor_area_meio)}</td>
                    <td class="center" style="font-size: 7.5pt;">${group.tipo_despesa}</td>
                    <td class="center" style="font-size: 7.5pt;">${group.forma_pagamento}</td>
                </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2" class="right">VALOR TOTAL =</td>
                    <td class="currency">R$ ${fmt(valorTotal)}</td>
                    <td></td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValor1grau)}</td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValor2grau)}</td>
                    <td colspan="2" class="currency">R$ ${fmt(totalValorAreaMeio)}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <!-- Metodologia -->
        <div class="methodology">
            <h4>Metodologia:</h4>
            <p>
                No cálculo da Distribuição Orçamentária foi utilizado como métrica a quantidade de colaboradores distribuídos
                nas unidades judiciárias e administrativas do TJGO.
            </p>
            <p>
                Por se tratar de uma solução tecnológica que é compartilhada por todos os usuários desta Instituição,
                a Equipe de Planejamento da Contratação entendeu que essa seria a forma razoável de distribuição dos custos.
            </p>
        </div>
    </div>
</body>
</html>`;
    }
}
