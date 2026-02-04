import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox } from '@mui/icons-material';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 2,
                textAlign: 'center',
            }}
        >
            <Box sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }}>
                {icon || <Inbox fontSize="inherit" />}
            </Box>
            <Typography variant="h6" gutterBottom color="text.primary" fontWeight="medium">
                {title}
            </Typography>
            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
                    {description}
                </Typography>
            )}
            {action && (
                <Button
                    variant="contained"
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </Box>
    );
}
