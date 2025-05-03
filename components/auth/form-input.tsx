import type React from "react"
import type { ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  showPasswordToggle?: boolean
  onTogglePassword?: () => void
  isPasswordVisible?: boolean
  error?: string
}

export function FormInput({
  icon,
  showPasswordToggle = false,
  onTogglePassword,
  isPasswordVisible,
  error,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="mb-4">
      {props.name && props.id && props.placeholder && (
        <label htmlFor={props.id} className="block text-sm font-medium mb-2">
          {props.placeholder}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">{icon}</div>
        <input
          className={cn(
            "w-full py-3 px-10 bg-[#f1f5f9] border-0 rounded-md focus:ring-2 focus:ring-black focus:outline-none",
            error && "border-red-500 focus:ring-red-500",
            className,
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            onClick={onTogglePassword}
            tabIndex={-1}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
