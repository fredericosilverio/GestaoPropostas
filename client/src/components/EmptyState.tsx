

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-5xl mb-4" role="img" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                    {description}
                </p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
