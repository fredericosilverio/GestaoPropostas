import { PrismaClient, Pca } from '@prisma/client';

const prisma = new PrismaClient();

// Enum de situações permitidas
const SITUACOES = ['EM_ELABORACAO', 'APROVADO', 'EM_EXECUCAO', 'ENCERRADO', 'CANCELADO'] as const;
type Situacao = typeof SITUACOES[number];

// Transições válidas de status
const VALID_TRANSITIONS: Record<string, string[]> = {
    'EM_ELABORACAO': ['APROVADO', 'CANCELADO'],
    'APROVADO': ['EM_EXECUCAO', 'CANCELADO', 'EM_ELABORACAO'],
    'EM_EXECUCAO': ['ENCERRADO', 'CANCELADO'],
    'ENCERRADO': [],
    'CANCELADO': []
};

export class PcaService {
    async list(filters?: any) {
        const where: any = { ativo: true };

        if (filters?.ano) where.ano = Number(filters.ano);
        if (filters?.orgao) where.orgao = { contains: filters.orgao };
        if (filters?.situacao) where.situacao = filters.situacao;

        return prisma.pca.findMany({
            where,
            include: {
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                responsavel_consolidacao: {
                    select: { id: true, nome_completo: true, email: true }
                },
                _count: {
                    select: { demandas: true }
                }
            },
            orderBy: [{ ano: 'desc' }, { versao: 'desc' }]
        });
    }

    async findById(id: number) {
        return prisma.pca.findUnique({
            where: { id },
            include: {
                responsavel: {
                    select: { id: true, nome_completo: true, email: true }
                },
                responsavel_consolidacao: {
                    select: { id: true, nome_completo: true, email: true }
                },
                demandas: {
                    include: {
                        _count: { select: { itens: true } }
                    }
                },
                versao_anterior: {
                    select: { id: true, versao: true, data_criacao: true }
                }
            }
        });
    }

    async create(data: any, userId: number) {
        // Validar ano
        if (data.ano < 2020 || data.ano > 2050) {
            throw new Error('Ano de referência deve estar entre 2020 e 2050');
        }

        // Validar órgão
        if (!data.orgao || data.orgao.trim().length < 3) {
            throw new Error('Órgão é obrigatório e deve ter pelo menos 3 caracteres');
        }

        // Check if PCA already exists for that Year/Organ
        const existing = await prisma.pca.findFirst({
            where: {
                ano: data.ano,
                orgao: data.orgao,
                ativo: true
            }
        });

        if (existing) {
            throw new Error(`Já existe um PCA para o ano ${data.ano} e órgão ${data.orgao}`);
        }

        // Gerar número do PCA no formato correto: PCA-[ANO]-[SEQUENCIAL]
        const lastPca = await prisma.pca.findFirst({
            where: { ano: data.ano },
            orderBy: { id: 'desc' }
        });

        const sequencial = lastPca ? parseInt(lastPca.numero_pca.split('-')[2] || '0') + 1 : 1;
        const numero_pca = `PCA-${data.ano}-${String(sequencial).padStart(3, '0')}`;

        return prisma.pca.create({
            data: {
                // Dados Gerais
                ano: data.ano,
                numero_pca,
                denominacao: data.denominacao || null,

                // Vinculação Institucional
                orgao: data.orgao.trim(),
                unidade_demandante: data.unidade_demandante || null,
                area_tecnica: data.area_tecnica || null,

                // Responsáveis
                responsavel_id: userId,
                responsavel_consolidacao_id: data.responsavel_consolidacao_id || null,
                contato_email: data.contato_email || null,
                contato_telefone: data.contato_telefone || null,

                // Versionamento
                situacao: 'EM_ELABORACAO',
                versao: 1,

                // Vigência
                periodo_vigencia_inicio: data.periodo_vigencia_inicio || null,
                periodo_vigencia_fim: data.periodo_vigencia_fim || null,

                // Aprovação
                autoridade_aprovadora: data.autoridade_aprovadora || null,
                cargo_autoridade: data.cargo_autoridade || null,
                forma_aprovacao: data.forma_aprovacao || null,
                documento_aprovacao: data.documento_aprovacao || null,
                data_aprovacao: data.data_aprovacao || null,

                // Observações
                observacoes: data.observacoes || null
            }
        });
    }

    async update(id: number, data: any) {
        const pca = await prisma.pca.findUnique({ where: { id } });

        if (!pca) throw new Error('PCA não encontrado');

        // Não permitir edição de PCA encerrado ou cancelado
        if (pca.situacao === 'ENCERRADO' || pca.situacao === 'CANCELADO') {
            throw new Error(`Não é possível editar PCA com situação "${pca.situacao}"`);
        }

        // Validar data de aprovação
        if (data.data_aprovacao) {
            const dataAprovacao = new Date(data.data_aprovacao);
            if (dataAprovacao < pca.data_criacao) {
                throw new Error('Data de aprovação não pode ser anterior à data de criação');
            }
        }

        // Não permitir alterar ano, numero_pca ou órgão após criação
        return prisma.pca.update({
            where: { id },
            data: {
                // Dados Gerais
                denominacao: data.denominacao || null,

                // Vinculação Institucional
                unidade_demandante: data.unidade_demandante || null,
                area_tecnica: data.area_tecnica || null,

                // Responsáveis
                responsavel_consolidacao_id: data.responsavel_consolidacao_id || null,
                contato_email: data.contato_email || null,
                contato_telefone: data.contato_telefone || null,

                // Versionamento
                historico_alteracoes: data.historico_alteracoes || null,

                // Vigência
                periodo_vigencia_inicio: data.periodo_vigencia_inicio || null,
                periodo_vigencia_fim: data.periodo_vigencia_fim || null,

                // Aprovação
                autoridade_aprovadora: data.autoridade_aprovadora || null,
                cargo_autoridade: data.cargo_autoridade || null,
                forma_aprovacao: data.forma_aprovacao || null,
                documento_aprovacao: data.documento_aprovacao || null,
                data_aprovacao: data.data_aprovacao || null,

                // Observações
                observacoes: data.observacoes || null
            }
        });
    }

    async delete(id: number, userId: number, justificativa?: string) {
        const pca = await prisma.pca.findUnique({
            where: { id },
            include: { _count: { select: { demandas: true } } }
        });

        if (!pca) throw new Error('PCA não encontrado');

        // Não permitir excluir PCA com demandas
        if (pca._count.demandas > 0) {
            throw new Error(`Não é possível excluir PCA com ${pca._count.demandas} demanda(s) vinculada(s). Remova as demandas primeiro.`);
        }

        // Não permitir excluir PCA em execução ou encerrado
        if (pca.situacao === 'EM_EXECUCAO' || pca.situacao === 'ENCERRADO') {
            throw new Error(`Não é possível excluir PCA com situação "${pca.situacao}"`);
        }

        // Soft delete
        return prisma.pca.update({
            where: { id },
            data: {
                ativo: false,
                observacoes: pca.observacoes
                    ? `${pca.observacoes}\n\n[EXCLUÍDO em ${new Date().toLocaleString('pt-BR')}]: ${justificativa || 'Sem justificativa'}`
                    : `[EXCLUÍDO em ${new Date().toLocaleString('pt-BR')}]: ${justificativa || 'Sem justificativa'}`
            }
        });
    }

    async changeStatus(id: number, newStatus: string, justificativa?: string) {
        const currentPca = await prisma.pca.findUnique({ where: { id } });
        if (!currentPca) throw new Error('PCA não encontrado');

        // Validar status
        if (!SITUACOES.includes(newStatus as Situacao)) {
            throw new Error(`Status inválido: ${newStatus}. Valores permitidos: ${SITUACOES.join(', ')}`);
        }

        // Validar transição
        const allowedTransitions = VALID_TRANSITIONS[currentPca.situacao] || [];
        if (!allowedTransitions.includes(newStatus)) {
            throw new Error(`Transição de status inválida: ${currentPca.situacao} → ${newStatus}. Transições permitidas: ${allowedTransitions.join(', ') || 'nenhuma'}`);
        }

        // Cancelamento requer justificativa
        if (newStatus === 'CANCELADO' && !justificativa) {
            throw new Error('Justificativa é obrigatória para cancelar um PCA');
        }

        // Em execução só permite se ano corrente = ano do PCA
        if (newStatus === 'EM_EXECUCAO') {
            const anoAtual = new Date().getFullYear();
            if (currentPca.ano !== anoAtual) {
                throw new Error(`PCA só pode entrar em execução no ano de referência (${currentPca.ano}). Ano atual: ${anoAtual}`);
            }
        }

        const updateData: any = { situacao: newStatus };

        if (newStatus === 'APROVADO') {
            updateData.data_aprovacao = new Date();
        }

        if (justificativa) {
            updateData.observacoes = currentPca.observacoes
                ? `${currentPca.observacoes}\n\n[${newStatus} em ${new Date().toLocaleString('pt-BR')}]: ${justificativa}`
                : `[${newStatus} em ${new Date().toLocaleString('pt-BR')}]: ${justificativa}`;
        }

        return prisma.pca.update({
            where: { id },
            data: updateData
        });
    }

    async getVersionHistory(pcaId: number) {
        // Encontrar o PCA mais recente desta linha de versões
        const pca = await prisma.pca.findUnique({ where: { id: pcaId } });
        if (!pca) throw new Error('PCA não encontrado');

        // Buscar todas as versões do mesmo ano/órgão/número
        const versions = await prisma.pca.findMany({
            where: {
                ano: pca.ano,
                orgao: pca.orgao,
                numero_pca: pca.numero_pca
            },
            include: {
                responsavel: {
                    select: { id: true, nome_completo: true }
                }
            },
            orderBy: { versao: 'desc' }
        });

        return versions;
    }

    async createNewVersion(id: number, motivo: string, userId: number) {
        if (!motivo || motivo.trim().length < 10) {
            throw new Error('Motivo da nova versão é obrigatório e deve ter pelo menos 10 caracteres');
        }

        const originalPca = await prisma.pca.findUnique({
            where: { id },
            include: { demandas: true }
        });

        if (!originalPca) throw new Error('PCA não encontrado');

        // Só permite criar versão de PCA aprovado ou em execução
        if (originalPca.situacao !== 'APROVADO' && originalPca.situacao !== 'EM_EXECUCAO') {
            throw new Error(`Só é possível criar nova versão de PCA com status APROVADO ou EM_EXECUCAO. Status atual: ${originalPca.situacao}`);
        }

        const newVersion = originalPca.versao + 1;

        // Transaction to ensure atomicity
        return prisma.$transaction(async (tx: any) => {
            // 1. Marcar versão anterior como inativa (opcional - depende da regra de negócio)
            // Mantemos ativo para histórico

            // 2. Criar nova versão do PCA
            const newPca = await tx.pca.create({
                data: {
                    ano: originalPca.ano,
                    numero_pca: originalPca.numero_pca,
                    orgao: originalPca.orgao,
                    situacao: 'EM_ELABORACAO', // Nova versão começa em elaboração
                    versao: newVersion,
                    versao_anterior_id: originalPca.id,
                    motivo_versao: motivo.trim(),
                    responsavel_id: userId,
                    observacoes: originalPca.observacoes
                }
            });

            // 3. Clonar demandas se existirem (opcional)
            if (originalPca.demandas.length > 0) {
                for (const demanda of originalPca.demandas) {
                    // Aqui poderia clonar as demandas se necessário
                    // Por enquanto, não clonamos automaticamente
                }
            }

            return newPca;
        });
    }

    /**
     * Retorna estatísticas agregadas das demandas por PCA ou geral
     */
    async getStatistics(filters?: { ano?: number; situacao?: string; pcaId?: number }) {
        const pcaWhere: any = { ativo: true };
        if (filters?.ano) pcaWhere.ano = Number(filters.ano);
        if (filters?.situacao) pcaWhere.situacao = filters.situacao;
        if (filters?.pcaId) pcaWhere.id = Number(filters.pcaId);

        // Buscar IDs de PCAs que atendem aos filtros
        const pcas = await prisma.pca.findMany({
            where: pcaWhere,
            select: { id: true }
        });
        const pcaIds = pcas.map(p => p.id);

        // Buscar todas as demandas ativas dos PCAs filtrados
        const demandas = await prisma.demanda.findMany({
            where: {
                pca_id: { in: pcaIds },
                ativo: true,
                status: { not: 'CANCELADA' }
            },
            select: {
                tipo_contratacao: true,
                natureza_despesa: true,
                valor_estimado_global: true
            }
        });

        // Inicializar contadores
        const porTipoContratacao: Record<string, { count: number; total: number }> = {
            'NOVA': { count: 0, total: 0 },
            'RENOVACAO': { count: 0, total: 0 },
            'PRORROGACAO': { count: 0, total: 0 },
            'ADESAO': { count: 0, total: 0 },
            'ENCERRAMENTO': { count: 0, total: 0 },
            'PLURIANUAL': { count: 0, total: 0 }
        };

        const porNaturezaDespesa: Record<string, { count: number; total: number }> = {
            'INVESTIMENTO': { count: 0, total: 0 },
            'CUSTEIO': { count: 0, total: 0 }
        };

        let totalDemandas = 0;
        let valorTotalGeral = 0;

        // Agregar dados
        for (const demanda of demandas) {
            const valor = Number(demanda.valor_estimado_global || 0);
            totalDemandas++;
            valorTotalGeral += valor;

            // Por tipo de contratação
            const tipo = demanda.tipo_contratacao || 'NOVA';
            if (porTipoContratacao[tipo]) {
                porTipoContratacao[tipo].count++;
                porTipoContratacao[tipo].total += valor;
            } else {
                porTipoContratacao[tipo] = { count: 1, total: valor };
            }

            // Por natureza de despesa
            const natureza = demanda.natureza_despesa || 'CUSTEIO';
            if (porNaturezaDespesa[natureza]) {
                porNaturezaDespesa[natureza].count++;
                porNaturezaDespesa[natureza].total += valor;
            } else {
                porNaturezaDespesa[natureza] = { count: 1, total: valor };
            }
        }

        return {
            totalDemandas,
            valorTotalGeral,
            porTipoContratacao,
            porNaturezaDespesa
        };
    }
}

