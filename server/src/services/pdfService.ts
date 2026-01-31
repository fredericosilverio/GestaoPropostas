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

export class PdfService {
    private options: PdfServiceOptions;

    constructor(options: PdfServiceOptions = {}) {
        this.options = {
            logoPath: options.logoPath || '',
            orgaoNome: options.orgaoNome || 'Estado de Goiás'
        };
    }

    async generateMarketAnalysisReport(demandaId: number): Promise<Buffer> {
        // Fetch Demanda with all relations
        const demanda = await prisma.demanda.findUnique({
            where: { id: demandaId },
            include: {
                responsavel: { select: { nome_completo: true, email: true } },
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

        // Calculate statistics for each item
        const itensComEstatisticas = demanda.itens.map(item => {
            const stats = marketAnalysisService.calculateStatistics(item.precos);
            return { ...item, estatisticas: stats };
        });

        // Generate HTML
        const html = this.generateHtml(demanda, itensComEstatisticas);

        // Launch puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            margin: { top: '20mm', bottom: '25mm', left: '15mm', right: '15mm' },
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="width: 100%; font-size: 9px; text-align: center; color: #666; padding: 5px;">
                    <span>Relatório de Análise de Mercado - ${demanda.codigo_demanda}</span>
                    <span style="margin-left: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                </div>
            `
        });

        await browser.close();

        return Buffer.from(pdf);
    }

    private generateHtml(demanda: any, itensComEstatisticas: any[]): string {
        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        const valorTotal = itensComEstatisticas.reduce(
            (acc, item) => acc + Number(item.valor_estimado_total || 0), 0
        );

        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Análise de Mercado</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }
        
        .cover {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            page-break-after: always;
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
            color: white;
            padding: 40px;
        }
        
        .cover h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .cover h2 {
            font-size: 22px;
            margin-bottom: 30px;
            font-weight: 600;
        }
        
        .cover .demanda-info {
            background: rgba(255,255,255,0.1);
            padding: 20px 40px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .cover .demanda-info h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .cover .demanda-info p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .cover .date {
            margin-top: 40px;
            font-size: 12px;
            opacity: 0.8;
        }
        
        .content {
            padding: 20px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1e3a5f;
            border-bottom: 2px solid #1e3a5f;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .info-item {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
        }
        
        .info-item label {
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            display: block;
            margin-bottom: 3px;
        }
        
        .info-item span {
            font-size: 11px;
            font-weight: 500;
        }
        
        .methodology {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #1e3a5f;
        }
        
        .methodology p {
            margin-bottom: 8px;
        }
        
        .item-section {
            page-break-inside: avoid;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .item-header {
            background: #1e3a5f;
            color: white;
            padding: 10px 15px;
        }
        
        .item-header h4 {
            font-size: 12px;
            font-weight: 500;
        }
        
        .item-body {
            padding: 15px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 10px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background: #f1f3f5;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 9px;
        }
        
        .price-aceito { background: #d4edda; }
        .price-acima { background: #f8d7da; }
        .price-abaixo { background: #fff3cd; }
        
        .stats-box {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            margin-top: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-item .value {
            font-size: 14px;
            font-weight: 600;
            color: #1e3a5f;
        }
        
        .stat-item .label {
            font-size: 9px;
            color: #666;
        }
        
        .estimated-value {
            background: #1e3a5f;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        
        .summary-box {
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .summary-box h3 {
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .summary-box .total {
            font-size: 24px;
            font-weight: 600;
        }
        
        .currency {
            font-family: monospace;
        }
    </style>
</head>
<body>
    <!-- CAPA -->
    <div class="cover">
        <h1>${this.options.orgaoNome}</h1>
        <h2>Relatório de Análise de Mercado</h2>
        
        <div class="demanda-info">
            <h3>${demanda.codigo_demanda}</h3>
            <p>${demanda.descricao}</p>
        </div>
        
        <p>PCA ${demanda.pca.ano} - Versão ${demanda.pca.versao}</p>
        <p>Unidade: ${demanda.unidade_demandante || 'Não informada'}</p>
        
        <div class="date">
            <p>Emitido em: ${dataEmissao}</p>
            <p>Responsável: ${demanda.responsavel?.nome_completo || 'Não informado'}</p>
        </div>
    </div>
    
    <!-- CONTEÚDO -->
    <div class="content">
        <!-- INFORMAÇÕES DA DEMANDA -->
        <div class="section">
            <h3 class="section-title">1. Identificação da Demanda</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Código da Demanda</label>
                    <span>${demanda.codigo_demanda}</span>
                </div>
                <div class="info-item">
                    <label>PCA</label>
                    <span>${demanda.pca.numero_pca}/${demanda.pca.ano}</span>
                </div>
                <div class="info-item">
                    <label>Tipo de Contratação</label>
                    <span>${demanda.tipo_contratacao || 'Não informado'}</span>
                </div>
                <div class="info-item">
                    <label>Natureza da Despesa</label>
                    <span>${demanda.natureza_despesa || 'Não informado'}</span>
                </div>
                <div class="info-item">
                    <label>Elemento de Despesa</label>
                    <span>${demanda.elemento_despesa || 'Não informado'}</span>
                </div>
                <div class="info-item">
                    <label>Unidade Demandante</label>
                    <span>${demanda.unidade_demandante || 'Não informado'}</span>
                </div>
            </div>
            
            <div class="info-item" style="margin-top: 10px;">
                <label>Justificativa Técnica</label>
                <span>${demanda.justificativa_tecnica || 'Não informada'}</span>
            </div>
        </div>
        
        <!-- METODOLOGIA -->
        <div class="section">
            <h3 class="section-title">2. Metodologia</h3>
            <div class="methodology">
                <p><strong>Base Legal:</strong> Este Relatório de Análise de Mercado foi elaborado em conformidade com a <strong>Lei Federal nº 14.133/2021</strong>, especialmente no que dispõe sobre o planejamento das contratações e a pesquisa de preços, bem como com o <strong>Decreto Estadual nº 9.900/2021</strong>, que regulamenta os procedimentos para pesquisa de preços no âmbito das contratações públicas do Estado de Goiás.</p>
                <p><strong>Critério de Aceitação dos Preços:</strong> Serão considerados válidos os preços que se encontrem dentro do intervalo de ±25% (vinte e cinco por cento) em relação à mediana dos valores coletados, conforme metodologia prevista na regulamentação vigente, com o objetivo de excluir valores excessivamente discrepantes e garantir maior aderência ao mercado.</p>
                <p><strong>Valor de Referência:</strong> O valor estimado da contratação foi definido com base na mediana dos preços válidos, adotada como critério principal por reduzir a influência de valores extremos (outliers) e proporcionar maior confiabilidade e representatividade do preço de mercado.</p>
                <p><strong>Fontes de Pesquisa:</strong> A pesquisa de preços foi realizada a partir de fontes diversificadas e idôneas, incluindo cotações obtidas junto a fornecedores, Painel de Preços do Governo Federal (ComprasNet, PNCP), bancos de preços estaduais e municipais, Atas de Registro de Preços vigentes e notas fiscais de contratações similares, de modo a assegurar a ampla representatividade e a fidedignidade dos valores coletados.</p>
            </div>
        </div>
        
        <!-- ITENS E PREÇOS -->
        <div class="section">
            <h3 class="section-title">3. Análise de Preços por Item</h3>
            
            ${itensComEstatisticas.map((item, index) => `
                <div class="item-section">
                    <div class="item-header">
                        <h4>Item ${item.codigo_item}: ${item.descricao}</h4>
                    </div>
                    <div class="item-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Unidade de Medida</label>
                                <span>${item.unidade_medida}</span>
                            </div>
                            <div class="info-item">
                                <label>Quantidade</label>
                                <span>${Number(item.quantidade).toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                        
                        ${item.especificacoes_tecnicas ? `
                            <div class="info-item" style="margin-bottom: 10px;">
                                <label>Especificações Técnicas</label>
                                <span>${item.especificacoes_tecnicas}</span>
                            </div>
                        ` : ''}
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Fonte</th>
                                    <th>Tipo</th>
                                    <th>Data Coleta</th>
                                    <th>Valor Unitário</th>
                                    <th>Classificação</th>
                                    <th>Variação</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${item.precos.map((preco: any) => `
                                    <tr class="${preco.classificacao === 'ACEITO' ? 'price-aceito' : preco.classificacao === 'ACIMA_DO_LIMITE' ? 'price-acima' : 'price-abaixo'}">
                                        <td>${preco.fonte}</td>
                                        <td>${preco.tipo_fonte}</td>
                                        <td>${new Date(preco.data_coleta).toLocaleDateString('pt-BR')}</td>
                                        <td class="currency">${Number(preco.valor_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td>${preco.classificacao}</td>
                                        <td>${preco.percentual_variacao ? preco.percentual_variacao.toFixed(1) + '%' : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <div class="stats-box">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="value">${Number(item.estatisticas.media || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    <div class="label">Média</div>
                                </div>
                                <div class="stat-item">
                                    <div class="value">${Number(item.estatisticas.mediana || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    <div class="label">Mediana</div>
                                </div>
                                <div class="stat-item">
                                    <div class="value">${Number(item.estatisticas.desvioPadrao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    <div class="label">Desvio Padrão</div>
                                </div>
                                <div class="stat-item">
                                    <div class="value">${(item.estatisticas.cv || 0).toFixed(1)}%</div>
                                    <div class="label">Coef. Variação</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="estimated-value">
                            <div>
                                <strong>Valor Estimado Unitário (Mediana):</strong>
                                <span class="currency" style="margin-left: 10px;">${Number(item.valor_estimado_unitario || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            <div>
                                <strong>Valor Estimado Total:</strong>
                                <span class="currency" style="margin-left: 10px;">${Number(item.valor_estimado_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- RESUMO -->
        <div class="section">
            <h3 class="section-title">4. Resumo Consolidado</h3>
            <div class="summary-box">
                <h3>Valor Total Estimado da Demanda</h3>
                <div class="total currency">${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                <p style="margin-top: 10px; font-size: 11px; opacity: 0.8;">
                    ${itensComEstatisticas.length} item(s) analisado(s) | ${itensComEstatisticas.reduce((acc, i) => acc + i.precos.length, 0)} preço(s) coletado(s)
                </p>
            </div>
        </div>
        
        <!-- ASSINATURA -->
        <div class="section" style="margin-top: 40px;">
            <div style="display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <div style="border-top: 1px solid #333; width: 200px; padding-top: 5px;">
                        <p style="font-size: 10px;">${demanda.responsavel?.nome_completo || 'Responsável'}</p>
                        <p style="font-size: 9px; color: #666;">Responsável pela Análise</p>
                    </div>
                </div>
                <div>
                    <div style="border-top: 1px solid #333; width: 200px; padding-top: 5px;">
                        <p style="font-size: 10px;">Gestor</p>
                        <p style="font-size: 9px; color: #666;">Aprovação Técnica</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }
}
