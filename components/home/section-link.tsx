import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionLinkProps {
  title: string
  href: string
  description?: string
}

export function SectionLink({ title, href, description }: SectionLinkProps) {
  return (
    <Link href={href} className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <ChevronRight className="h-5 w-5" />
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </Link>
  )
}
