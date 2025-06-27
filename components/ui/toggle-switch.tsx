"use client"

import { useState } from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  theme?: 'amber' | 'monochrome';
  className?: string;
}

export default function ToggleSwitch({ 
  enabled, 
  onChange, 
  label, 
  description,
  theme = 'monochrome',
  className = '' 
}: ToggleSwitchProps) {
  const activeColor = theme === 'amber' ? 'bg-amber-600' : 'bg-black';
  const inactiveColor = 'bg-gray-300';

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && <div className="text-sm font-medium text-black">{label}</div>}
          {description && <div className="text-xs text-gray-600">{description}</div>}
        </div>
      )}
      
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          enabled ? activeColor : inactiveColor
        } ${theme === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-gray-500'}`}
        onClick={() => onChange(!enabled)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}