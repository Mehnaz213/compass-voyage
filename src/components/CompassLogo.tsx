import React, { useState } from 'react';

interface CompassLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({
  size = 'md',
  className = '',
  alt = 'Compass Logistics International',
}) => {
  const [useFallback, setUseFallback] = useState(false);

  // Sizing configurations maintaining responsive 3:2 ratio
  const sizeClasses = {
    sm: 'h-8 max-w-[120px]',
    md: 'h-10 max-w-[150px]',
    lg: 'h-16 max-w-[240px]',
    xl: 'h-20 max-w-[300px]',
  };

  return (
    <img
      src={useFallback ? '/assets/compass-logistics-logo.png' : '/assets/compass-logistics-logo.svg'}
      alt={alt}
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
        }
      }}
      className={`block object-contain rounded-xl select-none shadow-sm ${sizeClasses[size]} ${className}`}
      loading="eager"
    />
  );
};
