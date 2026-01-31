

type StatusType =
    | 'RASCUNHO'
    | 'EM_ANALISE'
    | 'ESTIMADA'
    | 'EM_CONTRATACAO'
    | 'CONTRATADA'
    | 'CANCELADA'
    | 'APROVADO'
    | 'EM_ELABORACAO'
    | 'CRIACAO'
    | 'ATUALIZACAO'
    | 'EXCLUSAO'
    | 'ACEITO'
    | 'ACIMA_DO_LIMITE'
    | 'ABAIXO_DO_LIMITE'
    | 'INVALIDO_DATA';

interface StatusBadgeProps {
    status: StatusType | string;
    size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; label?: string }> = {
    // Demanda Status
    RASCUNHO: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
    EM_ANALISE: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', label: 'Em Análise' },
    ESTIMADA: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
    EM_CONTRATACAO: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', label: 'Em Contratação' },
    CONTRATADA: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
    CANCELADA: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200' },

    // PCA Status
    APROVADO: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
    EM_ELABORACAO: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', label: 'Em Elaboração' },

    // Audit Actions
    CRIACAO: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', label: 'Criação' },
    ATUALIZACAO: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', label: 'Atualização' },
    EXCLUSAO: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', label: 'Exclusão' },

    // Price Classification
    ACEITO: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
    ACIMA_DO_LIMITE: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', label: 'Acima do Limite' },
    ABAIXO_DO_LIMITE: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', label: 'Abaixo do Limite' },
    INVALIDO_DATA: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', label: 'Inválido (Data)' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-800 dark:text-gray-200'
    };

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
    const label = config.label || status.replace(/_/g, ' ');

    return (
        <span
            className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeClasses}`}
        >
            {label}
        </span>
    );
}
