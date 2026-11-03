import React, { useState } from 'react';

interface CompassLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCardBorder?: boolean;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({
  size = 'md',
  className = '',
  showCardBorder = true
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/assets/compass-logo.png');
  const [hasError, setHasError] = useState<boolean>(false);

  const sizeClasses = {
    xs: 'h-7 w-[42px]',
    sm: 'h-9 w-[54px]',
    md: 'h-12 w-[72px]',
    lg: 'h-16 w-[96px]',
    xl: 'h-24 w-[144px]'
  };

  const handleImgError = () => {
    if (imgSrc.endsWith('.png')) {
      // Try SVG fallback
      setImgSrc('/assets/compass-logo.svg');
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Elegant inline fallback rendering the official emblem
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg bg-[#00381C] text-white p-2 shadow-sm ${sizeClasses[size]} ${className}`}
        style={{ aspectRatio: '3/2' }}
        title="Compass Logistics International"
      >
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B7F500]"></div>
          <span className="text-[10px] font-extrabold tracking-wider text-white">COMPASS</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#003117] transition-transform duration-200 ${
        showCardBorder ? 'ring-1 ring-white/15 shadow-sm' : ''
      } ${sizeClasses[size]} ${className}`}
      style={{ aspectRatio: '3/2' }}
    >
      <img
        src={imgSrc}
        alt="Compass Logistics International Logo"
        onError={handleImgError}
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
