import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
        user: string;
        pass: string;
    };
}

interface StatusChangeEmail {
    demandaId: number;
    codigoDemanda: string;
    descricao: string;
    oldStatus: string;
    newStatus: string;
    responsavelEmail?: string;
    responsavelNome?: string;
}

// Labels amigáveis para status
const STATUS_LABELS: Record<string, string> = {
    'CADASTRADA': 'Cadastrada',
    'EM_ANALISE': 'Em Análise',
    'ESTIMADA': 'Estimada',
    'EM_CONTRATACAO': 'Em Contratação',
    'CONTRATADA': 'Contratada',
    'SUSPENSA': 'Suspensa',
    'CANCELADA': 'Cancelada'
};

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private configured: boolean = false;

    constructor() {
        this.configure();
    }

    private configure() {
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host) {
            console.log('📧 EmailService: SMTP não configurado. E-mails não serão enviados.');
            this.configured = false;
            return;
        }

        const config: EmailConfig = {
            host,
            port: Number(port) || 587,
            secure: Number(port) === 465
        };

        if (user && pass) {
            config.auth = { user, pass };
        }

        this.transporter = nodemailer.createTransport(config);
        this.configured = true;
        console.log(`📧 EmailService: Configurado para ${host}:${port}`);
    }

    async sendStatusChangeNotification(data: StatusChangeEmail): Promise<boolean> {
        if (!this.configured || !this.transporter) {
            console.log('📧 E-mail não enviado - SMTP não configurado');
            return false;
        }

        try {
            const oldStatusLabel = STATUS_LABELS[data.oldStatus] || data.oldStatus;
            const newStatusLabel = STATUS_LABELS[data.newStatus] || data.newStatus;

            const mailOptions = {
                from: process.env.SMTP_FROM || 'sistema@gestao.go.gov.br',
                to: data.responsavelEmail,
                subject: `[GestãoPropostas] Demanda ${data.codigoDemanda} - Status Alterado`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">Sistema de Gestão de Propostas</h1>
                            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Estado de Goiás</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f9fafb;">
                            <h2 style="color: #1e3a5f; margin-top: 0;">Notificação de Alteração de Status</h2>
                            
                            <p>Olá ${data.responsavelNome || 'Usuário'},</p>
                            
                            <p>A demanda abaixo teve seu status alterado:</p>
                            
                            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Código:</strong> ${data.codigoDemanda}</p>
                                <p style="margin: 5px 0;"><strong>Descrição:</strong> ${data.descricao}</p>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px;">
                                    <span style="background: #e5e7eb; padding: 5px 15px; border-radius: 20px;">${oldStatusLabel}</span>
                                    <span style="font-size: 20px;">→</span>
                                    <span style="background: #10b981; color: white; padding: 5px 15px; border-radius: 20px;">${newStatusLabel}</span>
                                </div>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                                Este é um e-mail automático. Não responda a esta mensagem.
                            </p>
                        </div>
                        
                        <div style="background: #1f2937; padding: 15px; text-align: center;">
                            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                                Sistema de Gestão de Propostas - Estado de Goiás
                            </p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`📧 E-mail enviado para ${data.responsavelEmail}`);
            return true;
        } catch (error) {
            console.error('📧 Erro ao enviar e-mail:', error);
            return false;
        }
    }

    async notifyStatusChange(demandaId: number, oldStatus: string, newStatus: string): Promise<void> {
        try {
            // Buscar demanda com responsável
            const demanda = await prisma.demanda.findUnique({
                where: { id: demandaId },
                include: {
                    responsavel: { select: { nome_completo: true, email: true } }
                }
            });

            if (!demanda || !demanda.responsavel?.email) {
                console.log('📧 Demanda ou e-mail do responsável não encontrado');
                return;
            }

            await this.sendStatusChangeNotification({
                demandaId,
                codigoDemanda: demanda.codigo_demanda,
                descricao: demanda.descricao,
                oldStatus,
                newStatus,
                responsavelEmail: demanda.responsavel.email,
                responsavelNome: demanda.responsavel.nome_completo
            });
        } catch (error) {
            console.error('📧 Erro ao processar notificação:', error);
        }
    }
}

// Singleton
export const emailService = new EmailService();
