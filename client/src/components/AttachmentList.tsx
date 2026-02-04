import { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Typography,
    Chip,
    Box,
    Paper,
    Link
} from '@mui/material';
import {
    Description as FileIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface Anexo {
    id: number;
    nome_arquivo: string;
    tamanho_bytes: number;
    created_at: string;
    uploaded_by: { nome_completo: string };
    nome_arquivo_storage: string;
    origem?: string; // 'Demanda' | 'Cotação'
}

interface Props {
    entityType: 'DEMANDA' | 'ITEM' | 'PRECO';
    entityId: number;
    refreshTrigger: number;
    consolidate?: boolean; // If true and entityType is DEMANDA, fetch all related attachments
}

export function AttachmentList({ entityType, entityId, refreshTrigger, consolidate = false }: Props) {
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        loadAnexos();
    }, [entityId, refreshTrigger, consolidate]);

    async function loadAnexos() {
        try {
            let response;
            if (consolidate && entityType === 'DEMANDA') {
                // Fetch all attachments related to this demand (including prices)
                response = await api.get(`/uploads/demanda/${entityId}`);
            } else {
                // Fetch only direct attachments
                response = await api.get('/uploads', {
                    params: { entityType, entityId }
                });
            }
            setAnexos(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Excluir anexo?')) return;
        try {
            await api.delete(`/uploads/${id}`);
            addToast({ type: 'success', title: 'Sucesso', description: 'Anexo excluído.' });
            loadAnexos();
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao excluir.' });
        }
    }

    if (anexos.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Nenhum anexo.
            </Typography>
        );
    }

    return (
        <List sx={{ width: '100%', mt: 2, p: 0 }}>
            {anexos.map(anexo => (
                <ListItem
                    key={anexo.id}
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 1, borderRadius: 1, p: 1 }}
                    secondaryAction={
                        <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDelete(anexo.id)} 
                            color="error" 
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <FileIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Link
                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/files/${anexo.nome_arquivo_storage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    color="primary"
                                    fontWeight="medium"
                                >
                                    {anexo.nome_arquivo}
                                </Link>
                                {anexo.origem && (
                                    <Chip
                                        label={anexo.origem}
                                        size="small"
                                        color={anexo.origem === 'Demanda' ? 'primary' : 'success'}
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                )}
                            </Box>
                        }
                        secondary={
                            <Typography variant="caption" color="text.secondary">
                                {(anexo.tamanho_bytes / 1024).toFixed(1)} KB • {anexo.uploaded_by?.nome_completo} • {new Date(anexo.created_at).toLocaleDateString()}
                            </Typography>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
