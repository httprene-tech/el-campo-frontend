import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
            ${error ? 'border-red-300' : 'border-gray-200'}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
