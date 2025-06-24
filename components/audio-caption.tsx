"use client"

import { useState, useEffect } from 'react';

interface AudioCaptionProps {
  responseText: string;
  audioElement: HTMLAudioElement | null;
  isVisible?: boolean;
  onComplete?: () => void;
}

export default function AudioCaption({ 
  responseText, 
  audioElement, 
  isVisible = true,
  onComplete 
}: AudioCaptionProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  // Split text into words when responseText changes
  useEffect(() => {
    if (responseText.trim()) {
      const wordArray = responseText.trim().split(/\s+/);
      setWords(wordArray);
      setCurrentWordIndex(0);
      setIsAnimating(false);
    }
  }, [responseText]);

  // Listen for audio events to sync caption timing
  useEffect(() => {
    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      if (audioElement.duration && !isNaN(audioElement.duration)) {
        setAudioDuration(audioElement.duration * 1000); // Convert to milliseconds
      }
    };

    const handlePlay = () => {
      setIsAnimating(true);
      setCurrentWordIndex(0);
    };

    const handleEnded = () => {
      setIsAnimating(false);
      setCurrentWordIndex(words.length); // Show all words
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    };

    const handleError = () => {
      // Show all text immediately if audio fails
      setIsAnimating(false);
      setCurrentWordIndex(words.length);
      if (onComplete) {
        setTimeout(onComplete, 100);
      }
    };

    const handlePause = () => {
      setIsAnimating(false);
    };

    const handleAbort = () => {
      setIsAnimating(false);
    };

    // Add event listeners
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('abort', handleAbort);

    return () => {
      // Cleanup event listeners
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('abort', handleAbort);
    };
  }, [audioElement, words.length, onComplete]);

  // Word-by-word animation timer
  useEffect(() => {
    if (!isAnimating || words.length === 0) return;

    // Calculate timing based on audio duration or fallback estimate
    const duration = audioDuration || (words.length * 400); // 400ms per word as fallback
    const wordInterval = duration / words.length;
    
    const timer = setInterval(() => {
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          clearInterval(timer);
          setIsAnimating(false);
          return words.length;
        }
        return nextIndex;
      });
    }, wordInterval);

    return () => clearInterval(timer);
  }, [isAnimating, words.length, audioDuration]);

  if (!isVisible || !responseText.trim()) {
    return null;
  }

  const displayedWords = words.slice(0, currentWordIndex + 1);
  const displayText = displayedWords.join(' ');

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl mx-auto px-4">
      <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg border border-gray-700/50">
        <p className="text-white text-center text-lg font-medium leading-relaxed min-h-[1.5em]">
          {displayText}
          {isAnimating && currentWordIndex < words.length - 1 && (
            <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />
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
      </div>
    </div>
  );
}