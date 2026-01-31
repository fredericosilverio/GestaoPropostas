// API Types for GestaoPropostas Frontend

// ===== User & Auth =====
export interface User {
    id: number;
    nome_completo: string;
    email: string;
    perfil: 'ADMIN' | 'GESTOR' | 'ANALISTA' | 'VISUALIZADOR';
    ativo: boolean;
}

// ===== PCA =====
export type SituacaoPca = 'EM_ELABORACAO' | 'EM_ANALISE' | 'APROVADO' | 'EM_EXECUCAO' | 'REVISADO' | 'ENCERRADO' | 'CANCELADO';
export type FormaAprovacao = 'DESPACHO' | 'PORTARIA' | 'DELIBERACAO' | 'OUTRO';

export interface Pca {
    id: number;

    // Dados Gerais
    ano: number;
    numero_pca: string;
    denominacao?: string;

    // Vinculação Institucional
    orgao: string;
    unidade_demandante?: string;
    area_tecnica?: string;

    // Responsáveis
    responsavel_id: number;
    responsavel?: {
        id: number;
        nome_completo: string;
        email?: string;
    };
    responsavel_consolidacao_id?: number;
    responsavel_consolidacao?: {
        id: number;
        nome_completo: string;
        email?: string;
    };
    contato_email?: string;
    contato_telefone?: string;

    // Datas e Versionamento
    data_criacao: string;
    versao: number;
    motivo_versao?: string;
    historico_alteracoes?: string;

    // Situação e Ciclo de Vida
    situacao: SituacaoPca;
    periodo_vigencia_inicio?: string;
    periodo_vigencia_fim?: string;

    // Aprovação Institucional
    data_aprovacao?: string;
    autoridade_aprovadora?: string;
    cargo_autoridade?: string;
    forma_aprovacao?: string;
    documento_aprovacao?: string;

    // Observações
    observacoes?: string;

    // Controle
    ativo: boolean;
    created_at: string;
    updated_at: string;

    // Relações
    _count?: {
        demandas: number;
    };
}

// ===== Demanda =====
export type DemandaStatus =
    | 'RASCUNHO'
    | 'EM_ANALISE'
    | 'ESTIMADA'
    | 'EM_CONTRATACAO'
    | 'CONTRATADA'
    | 'CANCELADA';

export type TipoContratacao = 'NOVA' | 'RENOVACAO' | 'PRORROGACAO' | 'ADESAO';
export type NaturezaDespesa = 'CUSTEIO' | 'INVESTIMENTO';

export interface Demanda {
    id: number;
    codigo_demanda: string;
    descricao: string;
    status: DemandaStatus;
    valor_estimado_global?: number;
    justificativa_tecnica?: string;
    justificativa_administrativa?: string;
    centro_custo?: string;
    prazo_vigencia_meses?: number;
    data_prevista_contratacao?: string;
    tipo_contratacao?: TipoContratacao;
    natureza_despesa?: NaturezaDespesa;
    elemento_despesa?: string;
    unidade_demandante?: string;
    pca?: {
        id: number;
        ano: number;
        orgao: string;
    };
    responsavel?: {
        nome_completo: string;
    };
    itens?: Item[];
}

// ===== Item =====
export interface Item {
    id: number;
    codigo_item: number;
    descricao: string;
    descricao_detalhada?: string;
    unidade_medida: string;
    quantidade: number;
    valor_estimado_unitario?: number;
    valor_estimado_total?: number;
    elemento_despesa?: string;
    _count?: {
        precos: number;
    };
}

// ===== Preço =====
export type ClassificacaoPreco =
    | 'ACEITO'
    | 'ACIMA_DO_LIMITE'
    | 'ABAIXO_DO_LIMITE'
    | 'INVALIDO_DATA';

export type TipoFonte =
    | 'COTACAO_FORNECEDOR'
    | 'PAINEL_PRECOS'
    | 'BANCO_PRECOS'
    | 'CONTRATACAO_SIMILAR'
    | 'NOTA_FISCAL'
    | 'OUTROS';

export interface Preco {
    id: number;
    valor_unitario: number;
    fonte: string;
    cnpj_fornecedor?: string;
    ativo: boolean;
    classificacao: ClassificacaoPreco;
    percentual_variacao?: number;
    unidade_medida: string;
    data_coleta: string;
    tipo_fonte: TipoFonte;
}

// ===== Dashboard =====
export interface DashboardStats {
    total: number;
    totalValorEstimado: number;
    byStatus: Record<DemandaStatus, number>;
}

export interface DashboardAlert {
    id: number;
    codigo_demanda: string;
    descricao: string;
    data_prevista_contratacao: string;
}

export interface DashboardSummary {
    stats: DashboardStats;
    alertas: DashboardAlert[];
}

// ===== Reports =====
export interface ReportItemPrice {
    id: number;
    fonte: string;
    data_coleta: string;
    valor_unitario: number;
    classificacao: ClassificacaoPreco;
}

export interface ReportItemStats {
    media: number;
    mediana: number;
    desvioPadrao: number;
    cv: number;
}

export interface ReportItem {
    id: number;
    codigo_item: number;
    descricao_detalhada: string;
    unidade_medida: string;
    quantidade: number;
    valor_estimado_unitario?: number;
    valor_estimado_final?: number;
    precos: ReportItemPrice[];
    estatisticas: ReportItemStats;
}

export interface MarketAnalysisReport {
    data_emissao: string;
    demanda: {
        codigo: string;
        descricao: string;
        pca: string;
        responsavel: string;
        unidade_demandante: string;
    };
    itens: ReportItem[];
    resumo: {
        valor_total_estimado: number;
    };
}

// ===== Audit =====
export type AuditAction = 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO';

export interface AuditLog {
    id: string;
    usuario?: {
        nome_completo: string;
        email: string;
    };
    acao: AuditAction;
    entidade_tipo: string;
    entidade_id: number;
    descricao: string;
    data_hora: string;
    ip_origem?: string;
    valor_anterior?: unknown;
    valor_novo?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ===== Anexos =====
export interface Anexo {
    id: number;
    nome_arquivo: string;
    tamanho_bytes: number;
    created_at: string;
    uploaded_by?: {
        nome_completo: string;
    };
    nome_arquivo_storage: string;
}

// ===== Fornecedor =====
export interface Fornecedor {
    id: number;
    razao_social: string;
    nome_fantasia?: string;
    cnpj: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
    responsavel_legal?: string;
    email_contato?: string;
    telefone_contato?: string;
    ativo: boolean;
}
