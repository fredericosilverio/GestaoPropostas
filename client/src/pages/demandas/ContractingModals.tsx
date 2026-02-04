import { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    Grid,
    CircularProgress
} from '@mui/material';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface InitiateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    demandaId: number;
}

export function InitiateContractingModal({ isOpen, onClose, onSuccess, demandaId }: InitiateModalProps) {
    const [processo, setProcesso] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/initiate-contracting`, { numero_processo: processo });
            addToast({ type: 'success', title: 'Sucesso', description: 'Contratação iniciada com sucesso!' });
            onSuccess();
            onClose();
            setProcesso('');
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao iniciar contratação' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Iniciar Contratação</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Número do Processo Licitatório"
                        type="text"
                        fullWidth
                        required
                        value={processo}
                        onChange={e => setProcesso(e.target.value)}
                        placeholder="Ex: 2024001234"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="warning" // Orange usually maps to warning or primary depending on theme, sticking to warning for now or custom
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Salvando...' : 'Iniciar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

interface FinalizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    demandaId: number;
}

export function FinalizeContractModal({ isOpen, onClose, onSuccess, demandaId }: FinalizeModalProps) {
    const [formData, setFormData] = useState({
        numero_contrato: '',
        data_contrato: new Date().toISOString().split('T')[0],
        valor_contratado: '',
        cnpj_fornecedor: '',
        razao_social: ''
    });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/demandas/${demandaId}/finalize-contract`, {
                ...formData,
                valor_contratado: Number(formData.valor_contratado)
            });
            addToast({ type: 'success', title: 'Sucesso', description: 'Contrato registrado com sucesso!' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Erro', description: 'Erro ao finalizar contrato' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Registrar Contrato</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <TextField
                                label="Número do Contrato"
                                fullWidth
                                required
                                value={formData.numero_contrato}
                                onChange={e => setFormData({ ...formData, numero_contrato: e.target.value })}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Data de Assinatura"
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={formData.data_contrato}
                                onChange={e => setFormData({ ...formData, data_contrato: e.target.value })}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Valor Contratado (R$)"
                                type="number"
                                fullWidth
                                required
                                inputProps={{ step: "0.01" }}
                                value={formData.valor_contratado}
                                onChange={e => setFormData({ ...formData, valor_contratado: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="CNPJ Fornecedor"
                                fullWidth
                                required
                                value={formData.cnpj_fornecedor}
                                onChange={e => setFormData({ ...formData, cnpj_fornecedor: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Razão Social"
                                fullWidth
                                required
                                value={formData.razao_social}
                                onChange={e => setFormData({ ...formData, razao_social: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="success"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Salvando...' : 'Confirmar Contratação'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
