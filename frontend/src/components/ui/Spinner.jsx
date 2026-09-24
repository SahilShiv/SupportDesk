import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin text-brand-600 ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label="Loading..."
    />
  );
}
