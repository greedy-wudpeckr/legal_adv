"use client"

import { cn } from '@/lib/utils';

interface SpeechSubtitleProps {
  text: string;
  isVisible?: boolean;
  className?: string;
}

export default function SpeechSubtitle({ 
  text, 
  isVisible = true, 
  className 
}: SpeechSubtitleProps) {
  if (!isVisible || !text.trim()) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40",
      "max-w-4xl mx-auto px-6 py-4",
      "bg-black/80 backdrop-blur-sm",
      "border border-amber-200/30 rounded-lg shadow-lg",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <p className="text-white text-center text-lg leading-relaxed font-medium">
        {text}
      </p>
      
      {/* Amber accent border */}
      <div className="absolute inset-0 rounded-lg border border-amber-400/20 pointer-events-none" />
      
      {/* Subtle amber glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
    </div>
  );
}