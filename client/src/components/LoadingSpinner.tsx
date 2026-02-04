import { CircularProgress, Box, Typography, Backdrop, Skeleton as MuiSkeleton } from '@mui/material';

interface LoadingSpinnerProps {
    size?: number | string;
    className?: string; // Kept for compatibility but not used for styling
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress size={size} />
        </Box>
    );
}

interface LoadingOverlayProps {
    message?: string;
    open?: boolean; // Added open prop for Backdrop
}

export function LoadingOverlay({ message = 'Carregando...', open = true }: LoadingOverlayProps) {
    // If used as a full page overlay
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2 }}
            open={open}
        >
            <CircularProgress color="inherit" />
            <Typography variant="body1" color="inherit">{message}</Typography>
        </Backdrop>
    );
}

interface SkeletonProps {
    className?: string; // Not used
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: number | string;
    height?: number | string;
}

export function Skeleton({ variant = 'text', width, height }: SkeletonProps) {
    return (
        <MuiSkeleton variant={variant} width={width} height={height} animation="wave" />
    );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <Box sx={{ width: '100%' }}>
             {Array.from({ length: rows }).map((_, rowIndex) => (
                <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <MuiSkeleton key={colIndex} variant="rectangular" height={40} sx={{ flex: 1, borderRadius: 1 }} animation="wave" />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
