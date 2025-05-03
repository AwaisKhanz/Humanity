import { Avatar } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"

interface AnswerCardProps {
  position: number
  name: string
  id: string
  likes: number
  avatarUrl?: string
  onClick?: () => void
}

export function AnswerCard({ position, name, id, likes, avatarUrl, onClick }: AnswerCardProps) {
  return (
    <div className="flex items-center border-b border-border p-4 hover:bg-secondary/50">
      <div className="flex-shrink-0 w-10 text-center font-semibold text-lg">{position}</div>
      <div className="ml-4 flex-grow">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{id}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold bg-black text-white px-3 py-1 rounded-full">Likes: {likes}</div>
        <Avatar src={avatarUrl} alt={name} size="md" />
        <button onClick={onClick} className="p-1 hover:bg-secondary rounded-full">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
