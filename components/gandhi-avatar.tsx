"use client"

import { useEffect, useState } from 'react';

interface GandhiAvatarProps {
  mood: 'confident' | 'worried' | 'neutral' | 'thinking';
  speaking: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function GandhiAvatar({ mood, speaking, size = 'medium' }: GandhiAvatarProps) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (speaking) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [speaking]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-16 h-16';
      case 'medium': return 'w-32 h-32';
      case 'large': return 'w-48 h-48';
    }
  };

  const getMoodEmoji = () => {
    if (speaking) {
      // Animated speaking states
      const speakingFrames = ['😮', '😯', '😲', '😮'];
      return speakingFrames[animationFrame];
    }
    
    switch (mood) {
      case 'confident': return '😤';
      case 'worried': return '😰';
      case 'thinking': return '🤔';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'confident': return 'from-red-100 to-red-200 border-red-300';
      case 'worried': return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 'thinking': return 'from-blue-100 to-blue-200 border-blue-300';
      case 'neutral': return 'from-gray-100 to-gray-200 border-gray-300';
      default: return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getAnimationClasses = () => {
    if (speaking) return 'animate-pulse';
    if (mood === 'thinking') return 'animate-bounce';
    if (mood === 'confident') return 'animate-pulse';
    return '';
  };

  return (
    <div className="relative">
      <div className={`
        ${getSizeClasses()} 
        bg-gradient-to-br ${getMoodColor()} 
        rounded-full 
        flex items-center justify-center 
        border-2 
        ${getAnimationClasses()}
        transition-all duration-300
      `}>
        <div className="text-4xl">
          {getMoodEmoji()}
        </div>
      </div>
      
      {/* Mood indicator */}
      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${
        mood === 'confident' ? 'bg-red-100 text-red-800' :
        mood === 'worried' ? 'bg-yellow-100 text-yellow-800' :
        mood === 'thinking' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {mood}
      </div>
      
      {/* Speaking indicator */}
      {speaking && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
}