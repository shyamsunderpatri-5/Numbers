import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-zinc-50 text-zinc-900 shadow hover:bg-zinc-50/80",
    secondary: "border-transparent bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
    destructive: "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80",
    outline: "text-zinc-50 border-zinc-800",
    ghost: "border-transparent bg-transparent text-zinc-400 hover:bg-zinc-800"
  }

  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2", variants[variant], className)} {...props} />
  )
}

export { Badge }
