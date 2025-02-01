"use client"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Chart({ className, ...props }: ChartProps) {
  return (
    <div className={cn("", className)} {...props} />
  )
}