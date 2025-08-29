import * as React from "react"
import { cn } from "@/lib/utils"

interface CSSMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: number
}

export function CSSMarquee({
  children,
  speed = 20,
  className,
  ...props
}: CSSMarqueeProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden py-4",
        className
      )} 
      {...props}
    >
      <div 
        className="flex animate-marquee-slide"
        style={{ 
          animationDuration: `${speed}s`,
        } as React.CSSProperties}
      >
        <div className="flex items-center space-x-12 shrink-0">
          {children}
        </div>
        <div className="flex items-center space-x-12 shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}