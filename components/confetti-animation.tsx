"use client"

import { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function ConfettiAnimation({ isVisible, onComplete }: ConfettiAnimationProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    velocity: { x: number; y: number };
    rotation: number;
    rotationSpeed: number;
  }>>([]);

  useEffect(() => {
    if (isVisible) {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      }));
      
      setParticles(newParticles);

      const animationDuration = 3000;
      const interval = setInterval(() => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            rotation: particle.rotation + particle.rotationSpeed,
            velocity: {
              ...particle.velocity,
              y: particle.velocity.y + 0.1 // gravity
            }
          })).filter(particle => particle.y < window.innerHeight + 20)
        );
      }, 16);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setParticles([]);
        onComplete?.();
      }, animationDuration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  );
}