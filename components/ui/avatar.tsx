import type * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
}

export function Avatar({ src, alt = "Avatar", size = "md", className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-secondary", sizeClasses[size], className)} {...props}>
      {src ? (
        <img src={src || "/placeholder.svg"} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
