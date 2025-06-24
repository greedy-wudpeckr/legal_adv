"use client"

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpeechSubtitleProps {
  text: string;
  isVisible?: boolean;
  className?: string;
  duration?: number; // Duration in milliseconds for the entire text
  onComplete?: () => void; // Callback when all words are displayed
}

export default function SpeechSubtitle({ 
  text, 
  isVisible = true, 
  className,
  duration = 3000, // Default 3 seconds
  onComplete
}: SpeechSubtitleProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (text.trim()) {
      const wordArray = text.trim().split(/\s+/);
      setWords(wordArray);
      setCurrentWordIndex(0);
      setIsAnimating(true);
    }
  }, [text]);

  useEffect(() => {
    if (!isVisible || words.length === 0 || !isAnimating) return;

    // If duration is very short (like 1ms), show all text immediately
    if (duration <= 100) {
      setCurrentWordIndex(words.length);
      setIsAnimating(false);
      if (onComplete) {
        setTimeout(onComplete, 100);
      }
      return;
    }

    const wordInterval = duration / words.length;
    
    const timer = setInterval(() => {
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        
        // If we've shown all words, call onComplete and stop
        if (nextIndex >= words.length) {
          clearInterval(timer);
          setIsAnimating(false);
          if (onComplete) {
            setTimeout(onComplete, 500); // Small delay before calling complete
          }
          return words.length; // Keep showing all words
        }
        
        return nextIndex;
      });
    }, wordInterval);

    return () => clearInterval(timer);
  }, [words, duration, isVisible, onComplete, isAnimating]);

  if (!isVisible || !text.trim()) {
    return null;
  }

  const displayedWords = words.slice(0, currentWordIndex + 1);
  const displayText = displayedWords.join(' ');

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40",
      "max-w-4xl mx-auto px-6 py-4",
      "bg-black/80 backdrop-blur-sm",
      "border border-amber-200/30 rounded-lg shadow-lg",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <p className="text-white text-center text-lg leading-relaxed font-medium min-h-[1.5em]">
        {displayText}
        {isAnimating && currentWordIndex < words.length - 1 && (
          <span className="inline-block w-2 h-6 bg-amber-400 ml-1 animate-pulse" />
        )}
      </p>
      
      {/* Progress indicator */}
      {words.length > 0 && (
        <div className="mt-3 w-full bg-gray-600/50 rounded-full h-1">
          <div 
            className="bg-amber-400 h-1 rounded-full transition-all duration-200 ease-out"
            style={{ 
              width: `${((currentWordIndex + 1) / words.length) * 100}%` 
            }}
          />
        </div>
      )}
      
      {/* Word counter for debugging (can be removed) */}
      <div className="absolute top-1 right-2 text-xs text-amber-300/70">
        {currentWordIndex + 1}/{words.length}
      </div>
      
      {/* Amber accent border */}
      <div className="absolute inset-0 rounded-lg border border-amber-400/20 pointer-events-none" />
      
      {/* Subtle amber glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
    </div>
  );
}