import { useEffect, useRef } from 'react';

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
    const dialogRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    // Focus trap and escape key
    useEffect(() => {
        if (isOpen) {
            confirmButtonRef.current?.focus();
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onCancel();
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: '⚠️',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        warning: {
            icon: '⚡',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        },
        info: {
            icon: 'ℹ️',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={dialogRef}
                    className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="text-2xl flex-shrink-0">{styles.icon}</div>
                        <div className="flex-1">
                            <h3
                                id="modal-title"
                                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                            >
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            ref={confirmButtonRef}
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${styles.button}`}
                        >
                            {loading ? 'Processando...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
