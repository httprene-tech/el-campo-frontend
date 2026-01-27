import React from 'react';

/**
 * PageHeader - Unified page header for all pages
 * Desktop: Shows title + action button
 * Mobile: Shows title only (FAB handles actions)
 */
const PageHeader = ({
  title,
  subtitle,
  action,
  backButton,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Back button for nested views */}
        {backButton && (
          <button
            onClick={backButton.onClick}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <backButton.icon className="w-5 h-5 text-gray-500" />
          </button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Desktop action button - hidden on mobile (FAB handles it) */}
      {action && (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className={`
            hidden sm:flex items-center gap-2
            px-4 py-2.5
            bg-emerald-500 hover:bg-emerald-600
            text-white font-medium
            rounded-xl
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
