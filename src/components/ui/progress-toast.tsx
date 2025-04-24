import * as React from "react"
import * as Progress from "@radix-ui/react-progress"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressToastProps {
  progress: number
  fileName: string
  onCancel?: () => void
  className?: string
}

export function ProgressToast({ progress, fileName, onCancel, className }: ProgressToastProps) {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 w-80 rounded-lg border bg-white p-4 shadow-lg",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium truncate flex-1">{fileName}</p>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="ml-2 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Progress.Root className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <Progress.Indicator
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <p className="mt-1 text-xs text-gray-500 text-right">{Math.round(progress)}%</p>
    </div>
  )
}
