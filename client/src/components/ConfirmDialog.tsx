import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import {
    Warning as WarningIcon,
    Info as InfoIcon,
    Error as ErrorIcon
} from '@mui/icons-material';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    onConfirm,
    onCancel,
    loading = false
}: ConfirmDialogProps) {
    const variantConfig = {
        danger: {
            icon: <ErrorIcon color="error" sx={{ fontSize: 40 }} />,
            color: 'error' as const
        },
        warning: {
            icon: <WarningIcon color="warning" sx={{ fontSize: 40 }} />,
            color: 'warning' as const
        },
        info: {
            icon: <InfoIcon color="info" sx={{ fontSize: 40 }} />,
            color: 'info' as const
        }
    };

    const config = variantConfig[variant];

    return (
        <Dialog
            open={isOpen}
            onClose={loading ? undefined : onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="confirm-dialog-title">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {config.icon}
                    <Typography variant="h6" component="span">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={onCancel} 
                    disabled={loading} 
                    color="inherit"
                    variant="outlined"
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    color={config.color}
                    variant="contained"
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
