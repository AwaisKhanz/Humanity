import { Avatar } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface ReviewCardProps {
  title: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl: string
  href: string
}

export function ReviewCard({ title, authorName, authorAvatarUrl, imageUrl, href }: ReviewCardProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="font-medium mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={authorAvatarUrl} alt={authorName} size="sm" />
            <span className="text-sm">{authorName}</span>
          </div>
          <Link href={href}>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
