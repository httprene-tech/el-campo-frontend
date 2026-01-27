import React from 'react';

/**
 * Textarea - Styled textarea matching Input component design
 */
const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 
          rounded-xl 
          border transition-colors duration-200
          ${error 
            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
            : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'
          }
          focus:outline-none focus:ring-2
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          placeholder:text-gray-600
          resize-none
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
