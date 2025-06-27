"use client"

import { Loader2, Crown, MessageSquare } from 'lucide-react';

interface HistoricalLoadingStatesProps {
  type: 'spinner' | 'skeleton' | 'message';
  text?: string;
  className?: string;
}

export default function HistoricalLoadingStates({ 
  type, 
  text = 'Loading...', 
  className = '' 
}: HistoricalLoadingStatesProps) {
  
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 opacity-25"></div>
        </div>
        <p className="text-base text-gray-600 font-medium">{text}</p>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Figure card skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'message') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
          </div>
        </div>
        <span className="text-sm text-gray-600">{text}</span>
      </div>
    );
  }

  return null;
}

// Error message component with monochrome theme
export function HistoricalErrorMessage({ 
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = ''
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 text-center ${className}`}>
      <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-black mb-2">Oops!</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}