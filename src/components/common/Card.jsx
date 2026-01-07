import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  onClick
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${paddings[padding]}
        ${hover ? 'hover:shadow-md hover:border-gray-200 transition-all cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
