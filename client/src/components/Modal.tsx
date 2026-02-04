import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}: ModalProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const maxWidthMap = {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl'
    } as const;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth={maxWidthMap[size]}
            fullScreen={fullScreen}
            aria-labelledby="modal-title"
        >
            <DialogTitle id="modal-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {title}
                {showCloseButton && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
}
