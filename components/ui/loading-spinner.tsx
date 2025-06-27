"use client"

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  theme?: 'amber' | 'monochrome';
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  theme = 'monochrome'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinnerColor = theme === 'amber' ? 'text-amber-600' : 'text-gray-400';
  const textColor = theme === 'amber' ? 'text-amber-700' : 'text-gray-600';

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin ${spinnerColor}`} />
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 opacity-25"></div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} ${textColor} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}