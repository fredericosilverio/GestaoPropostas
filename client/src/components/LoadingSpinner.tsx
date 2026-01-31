

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div
            className={`${sizeClasses[size]} border-gray-200 border-t-primary rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Carregando"
        />
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Carregando...' }: LoadingOverlayProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{message}</p>
        </div>
    );
}

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md'
    };

    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-zinc-700 ${variantClasses[variant]} ${className}`}
            aria-hidden="true"
        />
    );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="flex-1 h-8" variant="rectangular" />
                    ))}
                </div>
            ))}
        </div>
    );
}
