import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

interface PostCardProps {
  title: string
  slug: string
  imageUrl: string
  author: {
    name: string
    avatarUrl?: string
  }
}

export function PostCard({ title, slug, imageUrl, author }: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-video overflow-hidden">
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-3">{title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={author.avatarUrl} alt={author.name} size="sm" />
              <span className="text-sm">{author.name}</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
