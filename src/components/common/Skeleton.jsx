import React from 'react';

const Skeleton = ({ 
  className = '', 
  width, 
  height,
  rounded = 'lg',
  animate = true 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        ${roundedClasses[rounded]}
        ${animate ? 'animate-shimmer' : ''}
        ${className}
      `}
      style={{
        width: width,
        height: height,
        backgroundSize: '200% 100%',
      }}
    />
  );
};

// Skeleton para cards del dashboard
export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <Skeleton width={100} height={14} />
        <Skeleton width={140} height={28} />
        <Skeleton width={80} height={12} />
      </div>
      <Skeleton width={48} height={48} rounded="xl" />
    </div>
  </div>
);

// Skeleton para filas de tabla
export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton width={40} height={40} rounded="xl" />
    <div className="flex-1 space-y-2">
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} />
    </div>
    <Skeleton width={80} height={20} />
  </div>
);

// Skeleton para la página completa
export const SkeletonPage = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton width={200} height={28} />
      <Skeleton width={150} height={16} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;
