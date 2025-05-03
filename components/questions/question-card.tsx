import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface QuestionCardProps {
  id: string
  number: number
  title: string
  description: string
  imageUrl?: string
  videoUrl?: string
  showSubmitButton?: boolean
}

export function QuestionCard({
  id,
  number,
  title,
  description,
  imageUrl,
  videoUrl,
  showSubmitButton = true,
}: QuestionCardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase mb-1">QUESTION {number}</h2>
          <h3 className="text-4xl font-bold mb-4">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {showSubmitButton && (
          <div className="mt-2">
            <Link href={`/questions/${id}/answer`}>
              <Button className="rounded-full" variant="outline">
                Submit your answer here
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {imageUrl && <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />}
        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <Play className="h-8 w-8 text-white" fill="white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
