import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { MarketAnalysisService } from './marketAnalysisService';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const marketAnalysisService = new MarketAnalysisService();

interface PdfServiceOptions {
    logoPath?: string;
    orgaoNome?: string;
}

export class MarketAnalysisReportService {
    private options: PdfServiceOptions;

    constructor(options: PdfServiceOptions = {}) {
        this.options = {
            logoPath: options.logoPath || '',
            orgaoNome: options.orgaoNome || 'Estado de Goiás'
        };
    }

    async generateMarketAnalysisReport(demandaId: number, filterType: 'all' | 'median25' | 'median25fallback' = 'all'): Promise<Buffer> {
        // Fetch Demanda with all relations
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
                        }
                    },
                    orderBy: { codigo_item: 'asc' }
                }
            }
        });

        if (!demanda) {
            throw new Error('Demanda não encontrada');
        }

        // Calculate statistics for each item, optionally filtering prices for calculations
        const itensComEstatisticas = demanda.itens.map(item => {
            // 1. Calculate base stats to classify prices correctly for this report session
            const baseStats = marketAnalysisService.calculateStatistics(item.precos);

            // 2. Classify ALL prices based on the median of ALL prices
            const classifiedPrices = marketAnalysisService.classifyPrices(item.precos, baseStats.mediana);

            let precosParaCalculo = classifiedPrices;
            let observacoesAdicionais = '';

            // 3. Apply Filtering Logic
            let isFallbackScenario = false;
            if (filterType === 'median25' || filterType === 'median25fallback') {
                // Initial Filter
                let precosAceitos = classifiedPrices.filter((p: any) => p.classificacao === 'ACEITO');

                if (precosAceitos.length > 0) {
                    precosParaCalculo = precosAceitos;
                } else if (filterType === 'median25fallback') {
                    precosParaCalculo = classifiedPrices;
                    isFallbackScenario = true;
                    observacoesAdicionais = "Em razão da elevada disparidade entre os preços coletados para o item, não foi possível identificar valores que se enquadrassem integralmente nos critérios de aceitação definidos, com base no intervalo de ±25% em relação à mediana apurada, o que evidencia a heterogeneidade do mercado para esse tipo de serviço.";
                } else {
                    precosParaCalculo = [];
                }
            }

            // 4. Calculate final stats based on filtered (or fallback) prices
            const rawStats = marketAnalysisService.calculateStatistics(precosParaCalculo);
            const finalStats = {
                ...rawStats,
                media: rawStats.media ? Number(rawStats.media.toFixed(2)) : 0,
                // A mediana para exibição e classificação de variação deve sempre ser a mediana de TODOS os valores (baseStats)
                mediana: baseStats.mediana ? Number(baseStats.mediana.toFixed(2)) : 0,
                desvioPadrao: rawStats.desvioPadrao ? Number(rawStats.desvioPadrao.toFixed(2)) : 0,
                cv: rawStats.cv ? Number(rawStats.cv.toFixed(2)) : 0,
                min: rawStats.min ? Number(rawStats.min.toFixed(2)) : 0,
                max: rawStats.max ? Number(rawStats.max.toFixed(2)) : 0
            };

            // 5. Finalize prices with corrected variation and classification
            const precosFinalizados = classifiedPrices.map((p: any) => {
                const isUsed = precosParaCalculo.some((pc: any) => pc.id === p.id);
                const valor = Number(p.valor_unitario);

                // Recalculate variation relative to the FINAL median
                const percentual_variacao = finalStats.mediana > 0
                    ? ((valor - finalStats.mediana) / finalStats.mediana) * 100
                    : 0;

                let classificacao = p.classificacao;

                // Update classification to match the visual report logic
                if (isUsed) {
                    // Only mark as 'ACEITO' if NOT in fallback scenario.
                    // If fallback, we use the price but keep its original classification (relative to final stats)
                    // to show that it is technically outside the limits but used anyway.
                    if (!isFallbackScenario) {
                        classificacao = 'ACEITO';
                    }
                } else if (p.classificacao === 'INVALIDO_DATA') {
                    classificacao = 'INVALIDO_DATA';
                } else {
                    // If it's not used (and not invalid by date), check why it's out relative to FINAL stats
                    if (finalStats.mediana > 0) {
                        if (valor < finalStats.mediana * 0.75) classificacao = 'ABAIXO_DO_LIMITE';
                        else if (valor > finalStats.mediana * 1.25) classificacao = 'ACIMA_DO_LIMITE';
                    }
                }

                return {
                    ...p,
                    percentual_variacao,
                    classificacao
                };
            });

            // 6. Calculate total based on the FINAL mean (as per new requirements)
            const valor_estimado_total = Number((finalStats.media * Number(item.quantidade)).toFixed(2));

            return {
                ...item,
                observacoes: item.observacoes
                    ? (observacoesAdicionais ? `${item.observacoes}\n\n${observacoesAdicionais}` : item.observacoes)
                    : observacoesAdicionais,
                precos: precosFinalizados,
                precosParaCalculo: precosParaCalculo,
                estatisticas: finalStats,
                valor_estimado_unitario: finalStats.media, // Override database value with calculated final mean (per rule 4)
                valor_estimado_total: valor_estimado_total, // Override the database value with calculated value (per rule 5)
                filterApplied: filterType
            };
        });

        // Load logo as base64 if exists
        let logoBase64 = '';

        // Try multiple paths to find the logo (Docker vs Local vs Dist)
        const possiblePaths = [
            path.resolve(process.cwd(), 'uploads', 'logo-tjgo.png'),
            path.resolve(__dirname, '../../uploads', 'logo-tjgo.png'),
            path.resolve(__dirname, '../../../uploads', 'logo-tjgo.png'),
            path.join('/app/uploads', 'logo-tjgo.png') // Direct Docker path fallback
        ];

        let logoPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                logoPath = p;
                break;
            }
        }

        console.log('PDF Logo lookup:', logoPath ? `Found at ${logoPath}` : 'Not found in any expected location');

        if (logoPath) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }

        // Generate HTML
        const html = this.generateHtml(demanda, itensComEstatisticas, logoBase64);

        // Launch puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="width: 100%; font-size: 9px; text-align: center; color: #666; padding: 5px;">
                    <span>Análise de Mercado - ${demanda.codigo_demanda}</span>
                    <span style="margin-left: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                </div>
            `
        });

        await browser.close();

        return Buffer.from(pdf);
    }

    private generateHtml(demanda: any, itensComEstatisticas: any[], logoBase64: string): string {
        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        const dateFull = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        const valorTotal = itensComEstatisticas.reduce(
            (acc, item) => acc + Number(item.valor_estimado_total || 0), 0
        );

        // Logo HTML - show image if available, otherwise show nothing
        const logoHtml = logoBase64
            ? `<img src="${logoBase64}" alt="Logo" style="width: 80px; height: auto; margin-bottom: 5pt;"/>`
            : '';

        // Reference helper
        const references: string[] = [];
        const getRefIndex = (link: string | null) => {
            if (!link) return null;
            let idx = references.indexOf(link);
            if (idx === -1) {
                references.push(link);
                idx = references.length - 1;
            }
            return idx + 1;
        };

        // Formatting helpers
        const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

        const getTipoFonteLabel = (tipo: string) => {
            const mapping: Record<string, string> = {
                'COTACAO_FORNECEDOR': 'Cotação de Fornecedor',
                'PAINEL_PRECOS': 'Painel de Preços',
                'BANCO_PRECOS': 'Banco de Preços',
                'CONTRATACAO_SIMILAR': 'Contratação Similar',
                'NOTA_FISCAL': 'Nota Fiscal',
                'OUTROS': 'Outros'
            };
            return mapping[tipo] || (tipo ? capitalize(tipo.replace(/_/g, ' ')) : 'N/I');
        };

        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Análise de Mercado (v3)</title>
    <style>
        /* ========== RESET & BASE ========== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Times New Roman', Georgia, serif;
            font-size: 11pt;
            line-height: 1.2;
            color: #1a1a1a;
            background: #fff;
        }
        
        /* ========== CABEÇALHO DA PRIMEIRA PÁGINA (SUBSTITUI CAPA) ========== */
        .header-section {
            text-align: center;
            margin-bottom: 15pt;
            padding-bottom: 8pt;
        }
        
        .header-section h1 {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        
        .header-section .subtitle {
            font-size: 8pt;
            font-weight: normal;
            color: #444;
            margin-bottom: 1px;
        }
        
        .report-title {
            font-size: 14pt;
            font-weight: bold;
            color: #1e3a5f;
            margin-top: 15pt;
            text-align: center;
            text-transform: uppercase;
        }

        /* ========== CONTEÚDO ========== */
        .content { padding: 0 10px; }
        
        /* Seções */
        .section { margin-bottom: 18pt; }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #1e3a5f;
            margin-top: 20pt;
            margin-bottom: 12pt;
            padding-bottom: 4pt;
            border-bottom: 1.5px solid #1e3a5f;
            letter-spacing: 0.5px;
        }
        
        /* Grid de informações */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10pt;
            font-size: 10pt;
        }
        
        .info-table td {
            padding: 4pt 8pt;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        
        .info-table .label {
            width: 25%;
            background: #f8f8f8;
            font-weight: bold;
            color: #333;
            font-size: 9pt;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        
        .info-table .value { width: 25%; }
        
        /* Metodologia */
        .methodology {
            font-size: 10.5pt;
            text-align: justify;
            line-height: 1.25;
            padding: 10pt 12pt;
            background: #fafafa;
            border-left: 3px solid #1e3a5f;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        
        .methodology p { margin-bottom: 8pt; }
        .methodology p:last-child { margin-bottom: 0; }
        
        /* ========== ITENS - LAYOUT COMPACTO ========== */
        .item-block {
            page-break-inside: avoid;
            margin-bottom: 12pt;
            padding-bottom: 10pt;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .item-block:last-child { border-bottom: none; }
        
        .item-title {
            font-size: 11pt;
            font-weight: bold;
            color: #1e3a5f;
            margin-bottom: 4pt;
            padding-bottom: 3pt;
            border-bottom: 1px dotted #aaa;
        }
        
        .item-meta {
            font-size: 9.5pt;
            color: #555;
            margin-bottom: 6pt;
        }
        
        .item-meta span { margin-right: 15pt; }
        .item-meta strong { color: #333; }
        
        .item-specs {
            font-size: 9.5pt;
            font-style: italic;
            color: #666;
            margin-bottom: 6pt;
            padding-left: 8pt;
            border-left: 2px solid #ddd;
        }
        
        /* Tabela de Preços Compacta */
        .price-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
            margin-bottom: 6pt;
        }
        
        .price-table th {
            background: #f0f0f0;
            font-weight: bold;
            font-size: 8.5pt;
            padding: 3pt 4pt;
            border: 1px solid #ccc;
            text-align: left;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        
        .price-table td {
            padding: 2pt 4pt;
            border: 1px solid #ddd;
            vertical-align: middle;
        }
        
        .price-table .currency { font-size: 9pt; }
        
        .price-aceito { background: #e8f5e9 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .price-acima { background: #ffebee !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .price-abaixo { background: #ffebee !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        
        /* Estatísticas em Linha */
        .stats-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f5f7fa;
            padding: 4pt 8pt;
            font-size: 9pt;
            border: 1px solid #e0e0e0;
            margin-top: 4pt;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        
        .stats-line .stat {
            text-align: center;
            line-height: 1.15;
        }
        
        .stats-line .stat-value {
            font-weight: bold;
            font-size: 10pt;
            color: #1e3a5f;
        }
        
        .stats-line .stat-label {
            font-size: 7.5pt;
            color: #666;
            text-transform: uppercase;
        }
        
        .stats-line .total-box {
            background: #1e3a5f;
            color: #fff;
            padding: 3pt 8pt;
            border-radius: 2px;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        
        .stats-line .total-box .stat-value { color: #fff; }
        .stats-line .total-box .stat-label { color: #ccc; }

        .stats-line .interval-box {
            background: #2e7d32;
            color: #fff;
            padding: 3pt 8pt;
            border-radius: 2px;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
        .stats-line .interval-box .stat-value { color: #fff; font-size: 9.5pt; }
        .stats-line .interval-box .stat-label { color: #e8f5e9; }
        
        /* ========== RESUMO ========== */
        .summary-section {
            margin-top: 20pt;
            padding: 15pt;
            border: 2px solid #1e3a5f;
            text-align: center;
        }
        
        .summary-section h3 {
            font-size: 12pt;
            text-transform: uppercase;
            color: #1e3a5f;
            margin-bottom: 8pt;
        }
        
        .summary-section .total-value {
            font-size: 22pt;
            font-weight: bold;
            color: #1e3a5f;
            /* font-family: inherited; */
        }
        
        .summary-section .summary-meta {
            font-size: 9pt;
            color: #666;
            margin-top: 6pt;
        }
        
        /* ========== ASSINATURA ========== */
        .signature-section {
            margin-top: 30pt;
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        
        .signature-block {
            width: 250px;
            padding-top: 8pt;
            /* border-top: 0.5px solid #1a1a1a; Removed as requested */
            margin: 0 10pt;
        }
        
        .signature-block .name { 
            font-size: 10pt; 
            font-weight: bold; 
            color: #1a1a1a;
            margin-bottom: 2pt;
        }
        .signature-block .role { 
            font-size: 9pt; 
            color: #444; 
            line-height: 1.3;
        }
    </style>
</head>
<body>
    
    <!-- HEADER DA PÁGINA 1 -->
    <div class="header-section">
        ${logoHtml}
        <h1>Tribunal de Justiça do Estado de Goiás</h1>
        <p class="subtitle">Secretaria de Governança Judiciária e Tecnológica</p>
        <p class="subtitle">Diretoria de Infraestrutura em Tecnologia da Informação</p>
        <p class="subtitle">Coordenação de Contratos e Aquisições em TIC</p>
        
        <h1 class="report-title">Análise de Mercado</h1>
    </div>
    
    <!-- CONTEÚDO -->
    <div class="content">
        <!-- 1. IDENTIFICAÇÃO -->
        <div class="section">
            <h3 class="section-title">1. Identificação da Demanda</h3>
            <table class="info-table">
                <tr>
                    <td class="label">Código</td>
                    <td class="value">${demanda.codigo_demanda}</td>
                    <td class="label">PCA</td>
                    <td class="value">${demanda.pca.ano} - v${demanda.pca.versao}</td>
                </tr>
                <tr>
                    <td class="label">Tipo Contratação</td>
                    <td class="value">${demanda.tipo_contratacao || 'N/I'}</td>
                    <td class="label">Natureza</td>
                    <td class="value">${demanda.natureza_despesa || 'N/I'}</td>
                </tr>
                <tr>
                    <!-- REMOVIDO "ELEMENTO" E EXPANDIDO "UNIDADE DEMANDANTE" -->
                    <td class="label">Unidade Demandante</td>
                    <td colspan="3" class="value">${demanda.unidade_demandante || 'N/I'}</td>
                </tr>
            </table>
            <table class="info-table">
                <tr>
                    <td class="label" style="width: 15%;">Descrição</td>
                    <td style="text-align: justify;">${demanda.descricao || 'Não informada'}</td>
                </tr>
            </table>
            <table class="info-table">
                <tr>
                    <td class="label" style="width: 15%;">Justificativa</td>
                    <td style="text-align: justify;">${demanda.justificativa_tecnica || 'Não informada'}</td>
                </tr>
            </table>
        </div>
        
        <!-- 2. METODOLOGIA -->
        <div class="section">
            <h3 class="section-title">2. Metodologia</h3>
            <div class="methodology">
                <p><strong>Base Legal:</strong> Relatório elaborado conforme Lei Federal nº 14.133/2021 e Decreto Estadual nº 9.900/2021.</p>
                <p><strong>Critério de Aceitação:</strong> Preços válidos dentro do intervalo de ±25% em relação à mediana de todos os valores disponíveis.</p>
                <p><strong>Valor de Referência:</strong> Média aritmética dos preços válidos (aceitos).</p>
                <p><strong>Fontes:</strong> Painel de Preços (ComprasNet/PNCP), Atas de RP, NFs similares e Cotações de fornecedores.</p>
            </div>
        </div>
        
        <!-- 3. RESUMO CONSOLIDADO (MOVED UP) -->
        <div class="section">
            <h3 class="section-title">3. Resumo Consolidado</h3>
            
            <table class="price-table" style="margin-bottom: 15pt;">
                <thead>
                    <tr>
                        <th style="width:8%; text-align: center;">Item</th>
                        <th style="width:37%;">Descrição</th>
                        <th style="width:10%; text-align: center;">Unid.</th>
                        <th style="width:10%; text-align: center;">Qtd.</th>
                        <th style="width:17%; text-align: right;">Valor Unit. (Est.)</th>
                        <th style="width:18%; text-align: right;">Total (Est.)</th>
                    </tr>
                </thead>
                <tbody>
                    ${itensComEstatisticas.map((item, idx) => `
                    <tr>
                        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                        <td>${item.descricao}</td>
                        <td style="text-align: center;">${item.unidade_medida}</td>
                        <td style="text-align: center;">${Number(item.quantidade).toLocaleString('pt-BR')}</td>
                        <td class="currency" style="text-align: right;">R$ ${Number(item.valor_estimado_unitario || item.estatisticas.media || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td class="currency" style="text-align: right; font-weight: bold; color: #1e3a5f;">R$ ${Number(item.valor_estimado_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr style="background: #1e3a5f; color: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact;">
                        <td colspan="5" style="text-align: right; font-weight: bold; padding: 6pt 8pt; border: none;">VALOR TOTAL ESTIMADO:</td>
                        <td class="currency" style="text-align: right; font-weight: bold; font-size: 11pt; padding: 6pt 8pt; border: none; white-space: nowrap;">R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                </tfoot>
            </table>
            
            <p style="font-size: 9pt; color: #666; text-align: center; margin-top: 10pt;">
                ${itensComEstatisticas.length} item(s) analisado(s) | ${itensComEstatisticas.reduce((a, i) => a + i.precos.length, 0)} preço(s) coletado(s)
            </p>
        </div>

        <!-- 4. ANÁLISE DE PREÇOS (MOVED DOWN) -->
        <div class="section">
            <h3 class="section-title">4. Análise de Preços por Item</h3>
            
            ${itensComEstatisticas.map((item, idx) => `
            <div class="item-block">
                <div class="item-title">4.${item.codigo_item} - ${item.descricao} (Item ${item.codigo_item}).</div>
                <div class="item-meta">
                    <span><strong>Unid.:</strong> ${item.unidade_medida}</span>
                    <span><strong>Qtd.:</strong> ${Number(item.quantidade).toLocaleString('pt-BR')}</span>
                </div>
                ${item.especificacoes_tecnicas ? `<div class="item-specs">${item.especificacoes_tecnicas}</div>` : ''}
                
                <table class="price-table">
                    <thead>
                        <tr>
                            <th style="width:28%">Fornecedor</th>
                            <th style="width:18%">Origem do Preço</th>
                            <th style="width:12%">Data da Cotação</th>
                            <th style="width:15%">Valor Unitário</th>
                            <th style="width:10%">Variação</th>
                            <th style="width:17%">Classificação do Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${item.precos.map((p: any) => `
                        <tr class="${p.classificacao === 'ACEITO' ? 'price-aceito' : p.classificacao === 'ACIMA_DO_LIMITE' ? 'price-acima' : p.classificacao === 'ABAIXO_DO_LIMITE' ? 'price-abaixo' : 'price-invalido'}">
                            <td>${p.fonte || ''}${p.link_fonte ? ` <sup style="color: #1e3a5f; font-weight: bold;">[${getRefIndex(p.link_fonte)}]</sup>` : ''}</td>
                            <td>${getTipoFonteLabel(p.tipo_fonte)}</td>
                            <td>${new Date(p.data_coleta).toLocaleDateString('pt-BR')}</td>
                            <td class="currency">R$ ${Number(p.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>${p.percentual_variacao ? p.percentual_variacao.toFixed(2) + '%' : '–'}</td>
                            <td>${p.classificacao === 'ACEITO' ? 'Válido' : p.classificacao === 'ABAIXO_DO_LIMITE' ? 'Abaixo do Limite Inferior' : p.classificacao === 'ACIMA_DO_LIMITE' ? 'Acima do Limite Superior' : p.classificacao}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="stats-line">
                    <div class="stat"><div class="stat-value">R$ ${Number(item.estatisticas.mediana || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div class="stat-label">Mediana</div></div>
                    <div class="stat interval-box">
                        <div class="stat-value">
                            R$ ${(Number(item.estatisticas.mediana || 0) * 0.75).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                            a 
                            R$ ${(Number(item.estatisticas.mediana || 0) * 1.25).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div class="stat-label">Intervalo Aceitável (Mediana ±25%)</div>
                    </div>
                    <div class="stat" style="border: 2px solid #1e3a5f; padding: 2px 5px; border-radius: 4px;"><div class="stat-value">R$ ${Number(item.estatisticas.media || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div class="stat-label" style="color: #1e3a5f; font-weight: bold;">Média</div></div>
                    <div class="stat total-box"><div class="stat-value">R$ ${Number(item.valor_estimado_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div class="stat-label">Total Item</div></div>
                </div>
                ${item.observacoes ? `<div style="margin-top: 6pt; padding: 6pt 8pt; background: #fffbeb; border-left: 3px solid #f59e0b; font-size: 9pt; font-style: italic; print-color-adjust: exact; -webkit-print-color-adjust: exact; text-align: justify;"><strong>Obs.:</strong> ${item.observacoes}</div>` : ''}
            </div>
            `).join('')}
        </div>
        
        <!-- 5. OBSERVAÇÕES -->
        ${(demanda.observacoes || itensComEstatisticas.some(i => i.observacoes)) ? `
        <div class="section">
            <h3 class="section-title">5. Observações da Análise</h3>
            <div style="font-size: 10pt; line-height: 1.4;">
                ${demanda.observacoes ? `
                <div style="margin-bottom: 12pt; padding: 8pt 10pt; background: #fffbeb; border-left: 4px solid #f59e0b; print-color-adjust: exact; -webkit-print-color-adjust: exact;">
                    <strong style="color: #92400e;">Observações Gerais:</strong>
                    <p style="margin-top: 4pt; white-space: pre-wrap; text-align: justify;">${demanda.observacoes}</p>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        
        <!-- 6. REFERÊNCIAS -->
        ${references.length > 0 ? `
        <div class="section">
            <h3 class="section-title">6. Referências</h3>
            <ol style="font-size: 9pt; padding-left: 15px;">
                ${references.map(link => `
                <li style="margin-bottom: 3pt;">
                    <a href="${link}" target="_blank" style="color: #1e3a5f; text-decoration: none;">${link}</a>
                </li>
                `).join('')}
            </ol>
        </div>
        ` : ''}

        <!-- DATA ASSINATURA -->
        <div style="text-align: right; margin-top: 40px; margin-bottom: 20px; font-size: 11pt; color: #1a1a1a;">
            Goiânia, ${dateFull}.
        </div>

        <!-- ASSINATURA -->
        <div class="signature-section">
            <div class="signature-block">
                <p class="name">${demanda.responsavel?.nome_completo || 'Responsável'}</p>
                <p class="role">Coordenação de Contratos e Aquisições em TIC</p>
                <p class="role">Matricula: ${demanda.responsavel?.matricula || 'N/I'}</p>
            </div>
            <div class="signature-block">
                <p class="name">Sampahio Almeida M. Damaceno</p>
                <p class="role">Coordenador de Contratos e Aquisições em TIC</p>
                <p class="role">Matricula: 5155940</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }
}
