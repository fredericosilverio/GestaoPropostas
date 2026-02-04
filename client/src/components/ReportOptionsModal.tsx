import { useState } from 'react';
import {
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Typography,
    CircularProgress,
    Stack,
    Paper
} from '@mui/material';
import { Modal } from './Modal';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

interface ReportOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (filterType: 'all' | 'median25' | 'median25fallback') => void;
    isLoading?: boolean;
}

export function ReportOptionsModal({ isOpen, onClose, onGenerate, isLoading }: ReportOptionsModalProps) {
    const [filterType, setFilterType] = useState<'all' | 'median25' | 'median25fallback'>('median25fallback');

    const handleGenerate = () => {
        onGenerate(filterType);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Opções do Relatório">
            <Box sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Selecione como os valores devem ser considerados na análise:
                </Typography>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        aria-label="filter-type"
                        name="filter-type"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'median25' | 'median25fallback')}
                    >
                        <Paper variant="outlined" sx={{ mb: 2, p: 1, border: filterType === 'median25fallback' ? '2px solid' : '1px solid', borderColor: filterType === 'median25fallback' ? 'success.main' : 'divider', bgcolor: filterType === 'median25fallback' ? 'success.50' : 'background.paper', '&:hover': { bgcolor: filterType === 'median25fallback' ? 'success.50' : 'action.hover' } }}>
                            <FormControlLabel
                                value="median25fallback"
                                control={<Radio color="success" />}
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle1" component="div" fontWeight="bold" color="success.dark">
                                            ±25% da Mediana (Recomendado)
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Utiliza preços dentro de ±25% da mediana. Caso não existam preços válidos, utiliza <strong>todos os valores</strong> com justificativa legal automática.
                                        </Typography>
                                    </Box>
                                }
                                sx={{ m: 0, alignItems: 'flex-start', py: 1, width: '100%' }}
                            />
                        </Paper>
                        <Paper variant="outlined" sx={{ mb: 2, p: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                                            Considerar todos os valores
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Todos os preços coletados serão utilizados no cálculo das estatísticas (média, mediana, desvio padrão).
                                        </Typography>
                                    </Box>
                                }
                                sx={{ m: 0, alignItems: 'flex-start', py: 1, width: '100%' }}
                            />
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                            <FormControlLabel
                                value="median25"
                                control={<Radio />}
                                label={
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                                            Considerar apenas valores no intervalo de ±25% da mediana
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Apenas preços classificados como "Aceito" (dentro do intervalo de ±25% da mediana) serão utilizados nos cálculos.
                                        </Typography>
                                    </Box>
                                }
                                sx={{ m: 0, alignItems: 'flex-start', py: 1, width: '100%' }}
                            />
                        </Paper>
                    </RadioGroup>
                </FormControl>

                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        variant="contained"
                        color="success"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
                    >
                        {isLoading ? 'Gerando...' : 'Gerar PDF'}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
