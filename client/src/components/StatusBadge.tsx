import { Chip, type ChipProps } from '@mui/material';

type StatusType =
    | 'RASCUNHO'
    | 'EM_ANALISE'
    | 'ESTIMADA'
    | 'EM_CONTRATACAO'
    | 'CONTRATADA'
    | 'SUSPENSA'
    | 'CANCELADA'
    | 'APROVADO'
    | 'EM_ELABORACAO'
    | 'CRIACAO'
    | 'ATUALIZACAO'
    | 'EXCLUSAO'
    | 'ACEITO'
    | 'ACIMA_DO_LIMITE'
    | 'ABAIXO_DO_LIMITE'
    | 'INVALIDO_DATA'
    | string;

interface StatusBadgeProps {
    status: StatusType;
    size?: 'small' | 'medium';
}

const statusConfig: Record<string, { color: ChipProps['color']; label?: string }> = {
    // Demanda Status
    RASCUNHO: { color: 'default', label: 'Rascunho' },
    CADASTRADA: { color: 'default', label: 'Cadastrada' },
    EM_ANALISE: { color: 'info', label: 'Em Análise' },
    ESTIMADA: { color: 'secondary', label: 'Estimada' },
    EM_CONTRATACAO: { color: 'warning', label: 'Em Contratação' },
    CONTRATADA: { color: 'success', label: 'Contratada' },
    SUSPENSA: { color: 'error', label: 'Suspensa' },
    CANCELADA: { color: 'error', label: 'Cancelada' },

    // PCA Status
    APROVADO: { color: 'success', label: 'Aprovado' },
    EM_ELABORACAO: { color: 'warning', label: 'Em Elaboração' },

    // Audit Actions
    CRIACAO: { color: 'success', label: 'Criação' },
    ATUALIZACAO: { color: 'info', label: 'Atualização' },
    EXCLUSAO: { color: 'error', label: 'Exclusão' },

    // Price Classification
    ACEITO: { color: 'success', label: 'Aceito' },
    ACIMA_DO_LIMITE: { color: 'error', label: 'Acima do Limite' },
    ABAIXO_DO_LIMITE: { color: 'error', label: 'Abaixo do Limite' },
    INVALIDO_DATA: { color: 'default', label: 'Inválido (Data)' },
};

export function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        color: 'default',
        label: status.replace(/_/g, ' ')
    };

    return (
        <Chip
            label={config.label}
            color={config.color}
            size={size}
            variant="filled" // or outlined
            sx={{ fontWeight: 500 }}
        />
    );
}
