import React, { useEffect, useRef } from 'react';

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
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key and focus trap
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        // Focus first focusable element
        const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        }

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop with animation */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity duration-200 ease-out"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className={`relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full transform transition-all duration-200 ease-out`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                        <h3
                            id="modal-title"
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                        >
                            {title}
                        </h3>
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                aria-label="Fechar"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
