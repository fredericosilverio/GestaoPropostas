import { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import type { Fornecedor } from '../types/api';

interface FornecedorSelectProps {
    value: number | null;
    onChange: (id: number | null) => void;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
}

export function FornecedorSelect({ 
    value, 
    onChange, 
    required = false,
    error = false,
    helperText = '',
    label = "Selecione um Fornecedor"
}: FornecedorSelectProps) {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<Fornecedor | null>(null);

    useEffect(() => {
        async function loadFornecedores() {
            try {
                const response = await api.get('/fornecedores?ativo=true');
                setFornecedores(response.data);
            } catch (error) {
                console.error('Erro ao carregar fornecedores', error);
            } finally {
                setLoading(false);
            }
        }
        loadFornecedores();
    }, []);

    useEffect(() => {
        if (value && fornecedores.length > 0) {
            const found = fornecedores.find(f => f.id === value);
            setSelectedOption(found || null);
        } else if (!value) {
            setSelectedOption(null);
        }
    }, [value, fornecedores]);

    if (loading) {
        return <CircularProgress size={20} />;
    }

    return (
        <Autocomplete
            value={selectedOption}
            onChange={(_, newValue) => {
                setSelectedOption(newValue);
                onChange(newValue ? newValue.id : null);
            }}
            options={fornecedores}
            getOptionLabel={(option) => {
                const nome = option.nome_fantasia || option.razao_social;
                return `${nome} - ${option.cnpj}`;
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    error={error}
                    helperText={helperText}
                    fullWidth
                    variant="outlined"
                    size="small"
                />
            )}
            noOptionsText="Nenhum fornecedor encontrado"
        />
    );
}
