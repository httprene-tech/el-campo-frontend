import React from 'react';

/**
 * EmptyState - Unified empty state component for all pages
 * Mobile-optimized with large touch targets
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Icon */}
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-center text-sm max-w-xs">
          {description}
        </p>
      )}

      {/* Action Button - Desktop only (FAB handles mobile) */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
