"use client";
import React from 'react';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react';

import { cn } from '@/lib/utils';

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotPattern = {
    default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23ffffff' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
    hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23FF9800' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
  };

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div
      className={cn(
        "group relative flex w-full items-center justify-center bg-white",
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: dotPattern.default,
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
        style={{
          backgroundImage: dotPattern.hover,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};