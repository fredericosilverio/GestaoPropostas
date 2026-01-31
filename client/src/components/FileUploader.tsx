import React, { useRef, useState } from 'react';
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
        <div className="inline-block">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
            >
                {uploading ? (
                    <span className="animate-spin mr-2">⏳</span>
                ) : (
                    <span className="mr-2">📎</span>
                )}
                <span>Anexar Arquivo</span>
            </button>
        </div>
    );
}
