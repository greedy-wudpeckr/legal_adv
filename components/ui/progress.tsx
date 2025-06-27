import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  theme?: 'amber' | 'monochrome';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, theme = 'monochrome', ...props }, ref) => {
  const bgColor = theme === 'amber' ? 'bg-amber-200' : 'bg-gray-200';
  const fillColor = theme === 'amber' ? 'bg-amber-600' : 'bg-black';
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        `relative h-4 w-full overflow-hidden rounded-full ${bgColor}`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${fillColor} transition-all duration-500 ease-out`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }