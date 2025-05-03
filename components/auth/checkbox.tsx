import type React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  error?: string
}

export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  return (
    <div className="flex items-start mb-4">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={cn(
            "w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={props.id} className="font-medium text-gray-900">
          {label}
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
