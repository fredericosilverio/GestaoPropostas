import React, { useRef, useState } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface Props {
    entityType: 'DEMANDA' | 'ITEM' | 'PRECO';
    entityId: number;
    onUploadSuccess: () => void;
}

export function FileUploader({ entityType, entityId, onUploadSuccess }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const { addToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations (Size 10MB)
        if (file.size > 10 * 1024 * 1024) {
            addToast({ type: 'error', title: 'Erro', description: 'Arquivo muito grande (Max 10MB)' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', entityType);
        formData.append('entityId', entityId.toString());
        formData.append('descricao', file.name);

        setUploading(true);
        try {
            await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addToast({ type: 'success', title: 'Sucesso', description: 'Upload realizado com sucesso!' });
            onUploadSuccess();
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Falha no upload.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ display: 'inline-block' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <Button
                variant="outlined"
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <AttachFileIcon />}
            >
                {uploading ? 'Enviando...' : 'Anexar Arquivo'}
            </Button>
        </Box>
    );
}
