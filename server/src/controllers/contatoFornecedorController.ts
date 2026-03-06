import { Request, Response } from 'express';
import { ContatoFornecedorService } from '../services/contatoFornecedorService';
import exceljs from 'exceljs';
import puppeteer from 'puppeteer';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

const contatoService = new ContatoFornecedorService();

export class ContatoFornecedorController {
    async list(req: Request, res: Response) {
        try {
            const filters = {
                pca_id: req.query.pca_id ? Number(req.query.pca_id) : undefined,
                demanda_id: req.query.demanda_id ? Number(req.query.demanda_id) : undefined,
                fornecedor_id: req.query.fornecedor_id ? Number(req.query.fornecedor_id) : undefined,
                q: req.query.q as string | undefined
            };

            const contatos = await contatoService.list(filters);
            res.json(contatos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

            const contato = await contatoService.findById(id);
            if (!contato) return res.status(404).json({ error: 'Contato não encontrado' });
            res.json(contato);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = {
                ...req.body,
                data_hora: new Date(req.body.data_hora),
                conflito_interesse: Boolean(req.body.conflito_interesse),
                pca_id: req.body.pca_id ? Number(req.body.pca_id) : null,
                demanda_id: req.body.demanda_id ? Number(req.body.demanda_id) : null,
            };

            const contato = await contatoService.create(data);
            res.status(201).json(contato);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

            const data = { ...req.body };
            if (data.data_hora) data.data_hora = new Date(data.data_hora);

            const contato = await contatoService.update(id, data);
            res.json(contato);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

            await contatoService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async relatorio(req: Request, res: Response) {
        try {
            const filters = {
                pca_id: req.query.pca_id ? Number(req.query.pca_id) : undefined,
                demanda_id: req.query.demanda_id ? Number(req.query.demanda_id) : undefined,
                fornecedor_id: req.query.fornecedor_id ? Number(req.query.fornecedor_id) : undefined
            };

            const relatorioData = await contatoService.relatorioContatos(filters);
            res.json(relatorioData);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async export(req: Request, res: Response) {
        try {
            const format = req.query.format as string;
            if (format !== 'pdf' && format !== 'excel') {
                return res.status(400).json({ error: 'Formato inválido. Use "pdf" ou "excel".' });
            }

            const filters = {
                pca_id: req.query.pcaId ? Number(req.query.pcaId) : undefined,
                demanda_id: req.query.demandaId ? Number(req.query.demandaId) : undefined,
                fornecedor_id: req.query.fornecedorId ? Number(req.query.fornecedorId) : undefined,
                q: req.query.q as string | undefined
            };

            const contatos = await contatoService.list(filters);

            // ===== EXCEL =====
            if (format === 'excel') {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet('Controle de Fornecedor');

                worksheet.columns = [
                    { header: 'ID', key: 'id', width: 6 },
                    { header: 'Fornecedor', key: 'fornecedor', width: 35 },
                    { header: 'Representante', key: 'representante', width: 25 },
                    { header: 'Data', key: 'data_coleta', width: 14 },
                    { header: 'Horário', key: 'horario', width: 10 },
                    { header: 'Tipo/Meio', key: 'tipo', width: 22 },
                    { header: 'Servidores Envolvidos', key: 'servidores', width: 35 },
                    { header: 'Fonte de Pesquisa', key: 'fonte_pesquisa', width: 40 },
                    { header: 'Pauta', key: 'pauta', width: 55 },
                    { header: 'Resultado', key: 'resultado', width: 55 },
                    { header: 'Situação / Conflito', key: 'situacao', width: 30 },
                ];

                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
                headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                headerRow.height = 30;

                contatos.forEach((c: any) => {
                    // conflito_interesse=true = declarou AUSENCIA de conflito = OK
                    // conflito_interesse=false = NÃO declarou ausência = ALERTA
                    const declarouAusencia = c.conflito_interesse;
                    const row = worksheet.addRow({
                        id: c.id,
                        fornecedor: c.fornecedor.nome_fantasia || c.fornecedor.razao_social,
                        representante: c.representante ? c.representante.nome : 'N/A',
                        data_coleta: moment(c.data_hora).format('DD/MM/YYYY'),
                        horario: moment(c.data_hora).format('HH:mm'),
                        tipo: `${c.tipo_contato} (${c.local_meio})`,
                        servidores: c.servidores_envolvidos.map((se: any) => se.usuario.nome_completo).join('; '),
                        fonte_pesquisa: c.fonte_pesquisa || '',
                        pauta: c.pauta,
                        resultado: c.resultado,
                        situacao: declarouAusencia ? 'Ausência de conflito declarada' : 'ATENÇÃO: Dec. ausência não assinada',
                    });
                    row.alignment = { vertical: 'middle', wrapText: true };
                    if (!declarouAusencia) {
                        row.getCell('situacao').font = { color: { argb: 'FFCC0000' }, bold: true };
                    }
                });

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="controle_fornecedor.xlsx"');
                await workbook.xlsx.write(res);
                return res.end();
            }

            // ===== PDF =====
            if (format === 'pdf') {
                let logoBase64 = '';
                const possiblePaths = [
                    path.resolve(process.cwd(), 'uploads', 'logo-tjgo.png'),
                    path.resolve(__dirname, '../../uploads', 'logo-tjgo.png'),
                    path.resolve(__dirname, '../../../uploads', 'logo-tjgo.png'),
                ];
                for (const p of possiblePaths) {
                    if (fs.existsSync(p)) {
                        const logoBuffer = fs.readFileSync(p);
                        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
                        break;
                    }
                }

                // Group contatos by fornecedor
                const grouped: Record<string, { nome: string; cnpj: string; contatos: any[] }> = {};
                contatos.forEach((c: any) => {
                    const key = String(c.fornecedor_id);
                    if (!grouped[key]) {
                        grouped[key] = {
                            nome: c.fornecedor.nome_fantasia || c.fornecedor.razao_social,
                            cnpj: c.fornecedor.cnpj || '',
                            contatos: []
                        };
                    }
                    grouped[key].contatos.push(c);
                });

                const formatCnpj = (cnpj: string) => {
                    const digits = (cnpj || '').replace(/\D/g, '');
                    if (digits.length === 14) {
                        return `CNPJ: ${digits.substr(0, 2)}.${digits.substr(2, 3)}.${digits.substr(5, 3)}/${digits.substr(8, 4)}-${digits.substr(12, 2)}`;
                    }
                    return cnpj ? `CNPJ: ${cnpj}` : '';
                };

                const fornecedorTableRows = Object.values(grouped).map((forn, fi) => {
                    return forn.contatos.map((c: any, ci: number) => {
                        return `
                        <tr>
                            ${ci === 0 ? `<td rowspan="${forn.contatos.length}" class="fornecedor-cell">
                                <strong>${fi + 1}. ${forn.nome}</strong><br/>
                                <span class="cnpj">${formatCnpj(forn.cnpj)}</span>
                            </td>` : ''}
                            <td class="fonte-col">${c.fonte_pesquisa || '\u2014'}</td>
                            <td class="center">${moment(c.data_hora).format('DD/MM/YYYY')}</td>
                            <td class="center">${moment(c.data_hora).format('HH:mm')}</td>
                            <td>${c.tipo_contato}<br/><small>${c.local_meio}</small></td>
                            <td>${c.representante ? c.representante.nome : '\u2014'}</td>
                            <td class="pauta-col">${c.pauta || '\u2014'}</td>
                        </tr>
                    `}).join('');
                }).join('');

                const emptyMsg = contatos.length === 0
                    ? `<tr><td colspan="7" style="text-align:center;padding:20pt;color:#666;">Nenhum registro encontrado para os filtros informados.</td></tr>`
                    : '';

                const logoHtml = logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="width:135px;height:auto;"/>` : '';

                const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Controle de Fornecedor</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Times New Roman',Georgia,serif; font-size:9pt; color:#1a1a1a; background:#fff; }

  /* ===== INSTITUTIONAL HEADER ===== */
  .header-table { width:100%; border-collapse:collapse; margin-bottom:16pt; table-layout:fixed; }
  .header-table td { border:1px solid #aaa; vertical-align:middle; text-align:center; padding:3pt; }
  .header-logo-cell { width:22%; padding:5pt !important; }
  .header-logo-cell .coord-nome { font-size:6.5pt; display:block; margin-top:3pt; color:#444; }
  .header-title-main { font-size:12pt; font-weight:bold; text-transform:uppercase; padding:6pt !important; }
  .header-subtitle { font-size:8.5pt; font-weight:bold; background:#fcfcfc; padding:3pt !important; }
  .header-meta-grid { padding:0 !important; }
  .header-meta-table { width:100%; border-collapse:collapse; border:none; }
  .header-meta-table td { border:none; border-right:1px solid #aaa; font-size:8pt; padding:2pt 4pt !important; }
  .header-meta-table td:last-child { border-right:none; }
  .label { font-weight:bold; }

  /* ===== DATA TABLE ===== */
  .main-table { width:100%; border-collapse:collapse; font-size:8pt; }
  .main-table thead tr { background:#1e3a5f; color:#fff; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
  .main-table th { padding:5pt 4pt; border:1px solid #1e3a5f; text-align:center; font-size:7.5pt; font-weight:bold; }
  .main-table td { padding:4pt; border:1px solid #ccc; vertical-align:top; }
  .center { text-align:center; }
  .fornecedor-cell { font-size:8pt; background:#eef2f7; font-weight:normal; print-color-adjust:exact; -webkit-print-color-adjust:exact; vertical-align:middle !important; }
  .cnpj { font-size:7pt; color:#555; }
  .pauta-col { font-size:7.5pt; color:#333; line-height:1.4; text-align:justify; overflow-wrap:normal; word-break:normal; }
  .fonte-col { font-size:7.5pt; color:#444; text-align:justify; overflow-wrap:normal; word-break:normal; }

  /* ===== FOOTER ===== */
  .footer-note { margin-top:16pt; font-size:7.5pt; color:#666; text-align:center; border-top:1px solid #ccc; padding-top:6pt; }
</style>
</head>
<body>

<!-- INSTITUTIONAL HEADER (same style as Análise de Mercado) -->
<table class="header-table">
  <tr>
    <td rowspan="3" class="header-logo-cell">
      ${logoHtml}
      <span class="coord-nome">Coordenadoria de Contratos e Aquisições de TIC</span>
    </td>
    <td class="header-title-main">Controle de Fornecedor</td>
  </tr>
  <tr>
    <td class="header-subtitle">Registro de Interações e Contatos com Fornecedores — Decreto Estadual nº 9.900/2021</td>
  </tr>
  <tr>
    <td class="header-meta-grid">
      <table class="header-meta-table">
        <tr>
          <td><span class="label">Emissão:</span> ${moment().format('DD/MM/YYYY HH:mm')}</td>
          <td><span class="label">Filtros:</span> PCA: ${req.query.pcaId || 'Todos'} / Demanda: ${req.query.demandaId || 'Todas'} / Fornecedor: ${req.query.fornecedorId || 'Todos'}</td>
          <td><span class="label">Total:</span> ${contatos.length} registro(s)</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- MAIN DATA TABLE (spreadsheet-style, grouped by supplier) -->
<table class="main-table">
  <thead>
    <tr>
      <th style="width:17%">Empresa</th>
      <th style="width:20%">Fonte de Pesquisa</th>
      <th style="width:8%">Data</th>
      <th style="width:6%">Horário</th>
      <th style="width:11%">Tipo / Meio</th>
      <th style="width:13%">Representante</th>
      <th style="width:25%">Pauta</th>
    </tr>
  </thead>
  <tbody>
    ${fornecedorTableRows}
    ${emptyMsg}
  </tbody>
</table>

<div class="footer-note">
  Documento gerado em atendimento ao Art. 6º, VI, Dec. Est. nº 9.900/2021.
</div>
</body>
</html>`;

                const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                const page = await browser.newPage();
                await page.setContent(html, { waitUntil: 'networkidle0' });
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    landscape: true,
                    margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
                    printBackground: true
                });
                await browser.close();

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="controle_fornecedor.pdf"');
                return res.send(pdfBuffer);
            }

        } catch (error: any) {
            console.error('Erro ao exportar', error);
            res.status(500).json({ error: error.message });
        }
    }
}
