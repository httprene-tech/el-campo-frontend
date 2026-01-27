import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
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
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white
            transition-all duration-200
            placeholder:text-gray-600
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
