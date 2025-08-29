import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: number
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden",
        className
      )} 
      {...props}
    >
      <div 
        className={cn(
          "flex animate-marquee items-center",
          pauseOnHover && "hover:[animation-play-state:paused]",
          direction === "right" && "[animation-direction:reverse]"
        )}
        style={{ 
          animationDuration: `${speed}s`,
          width: 'max-content'
        } as React.CSSProperties}
      >
        <div className="flex items-center shrink-0 justify-around min-w-full px-4">
          {React.Children.map(children, (child, index) => (
            <div key={`first-${index}`} className="mx-8 flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
        <div className="flex items-center shrink-0 justify-around min-w-full px-4">
          {React.Children.map(children, (child, index) => (
            <div key={`second-${index}`} className="mx-8 flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}