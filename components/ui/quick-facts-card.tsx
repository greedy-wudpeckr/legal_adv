"use client"

import { LucideIcon } from 'lucide-react';

interface QuickFactsCardProps {
  title: string;
  facts: Array<{
    label: string;
    value: string;
    icon?: LucideIcon;
  }>;
  theme?: 'amber' | 'monochrome';
  className?: string;
}

export default function QuickFactsCard({ 
  title, 
  facts, 
  theme = 'monochrome',
  className = '' 
}: QuickFactsCardProps) {
  const borderColor = theme === 'amber' ? 'border-amber-200' : 'border-gray-200';
  const accentColor = theme === 'amber' ? 'text-amber-600' : 'text-gray-600';

  return (
    <div className={`bg-white rounded-lg border ${borderColor} p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
      <div className="space-y-3">
        {facts.map((fact, index) => {
          const Icon = fact.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Icon && <Icon className={`w-4 h-4 ${accentColor}`} />}
                <span className="text-sm text-gray-600">{fact.label}</span>
              </div>
              <span className="text-sm font-medium text-black">{fact.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}