import Link from "next/link"
import type { ReactNode } from "react"

interface AuthCardProps {
  logo?: ReactNode
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ logo, title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2f2] px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          {logo || (
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold">humanity_</h1>
            </Link>
          )}
          <p className="text-muted-foreground">{subtitle}</p>
          <h2 className="text-2xl font-bold mt-2">{title}</h2>
        </div>

        {children}

        {footer && <div className="text-center mt-6">{footer}</div>}
      </div>
    </div>
  )
}
