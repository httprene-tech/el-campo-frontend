import React from 'react';
import { AlertCircle, Egg } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Egg,
  title = 'Sin datos',
  description = 'No hay información para mostrar',
  actionLabel,
  onAction,
  variant = 'default' // default, error, search
}) => {
  const variants = {
    default: {
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-400',
    },
    error: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-400',
    },
    search: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-400',
    },
  };

  const config = variants[variant];
  const IconComponent = variant === 'error' ? AlertCircle : Icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mb-4`}>
        <IconComponent className={`w-10 h-10 ${config.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
