"use client"

import { useState, useEffect } from 'react';

interface HistoricalCaptionProps {
  text: string;
  isVisible?: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function HistoricalCaption({ 
  text, 
  isVisible = true, 
  onComplete,
  duration = 4000 
}: HistoricalCaptionProps) {
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

    const wordInterval = duration / words.length;
    
    const timer = setInterval(() => {
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          clearInterval(timer);
          setIsAnimating(false);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return words.length;
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl mx-auto px-4">
      <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-black text-center text-lg font-medium leading-relaxed min-h-[1.5em]">
          {displayText}
          {isAnimating && currentWordIndex < words.length - 1 && (
            <span className="inline-block w-2 h-6 bg-black ml-1 animate-pulse" />
          )}
        </p>
        
        {/* Progress indicator */}
        {words.length > 0 && (
          <div className="mt-3 w-full bg-gray-300 rounded-full h-1">
            <div 
              className="bg-black h-1 rounded-full transition-all duration-200 ease-out"
              style={{ 
                width: `${((currentWordIndex + 1) / words.length) * 100}%` 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}