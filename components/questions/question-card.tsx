import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import Image from "next/image";

interface QuestionCardProps {
  id: string;
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  showSubmitButton?: boolean;
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
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Question {number}
            </div>
            <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 mb-6 line-clamp-3">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/questions/${id}`}>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
                View Question <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {showSubmitButton && (
              <Link href={`/questions/${id}/answer`}>
                <Button className="rounded-full" variant="outline">
                  Submit Answer
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="relative aspect-video md:h-full">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-lg">
                <Play className="h-8 w-8 text-white" fill="white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
