import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  theme?: 'amber' | 'monochrome';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, theme = 'monochrome', ...props }, ref) => {
    const focusColor = theme === 'amber' 
      ? 'focus-visible:ring-amber-500 focus:border-amber-500' 
      : 'focus-visible:ring-gray-500 focus:border-gray-500';
    
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 hover:border-gray-400 ${focusColor}`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }