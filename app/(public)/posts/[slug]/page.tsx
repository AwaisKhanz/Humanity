import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

interface PostPageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  // In a real app, you would fetch the post data based on the slug
  const post = {
    title: "Every town should discuss the questions weekly",
    date: "22 Jan 2025",
    author: {
      name: "PATRICK M WOOD",
      location: "Canada",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    content: [
      {
        type: "heading",
        content: "What is growth hack?",
      },
      {
        type: "paragraph",
        content:
          "Tincidunt magnis eu, vitae dictumst commodo dolor in. Aen ean dictumst risus posuere a at id fermentum nibh. Luctus nunc bibendum duis egestas scelerisque.",
      },
      {
        type: "paragraph",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id pellentesque ut pellentesque varius amet mauris. Tempor, risus, congue gravida nulla tincidunt nec diam. Tincidunt magnis eu, vitae dictumst commodo dolor in. Aenean dictumst risus posuere a at id fermentum nibh. Luctus nunc bibendum duis egestas scelerisque.",
      },
      {
        type: "paragraph",
        content:
          "Maecenas in pharetra hendrerit neque, tellus eu. Arcu tempus, vel blandit adipiscing a sed cursus. Augue vestibulum tempus lectus gravida condimentum mauris iaculis.",
      },
      {
        type: "heading",
        content: "How to start growing business?",
      },
      {
        type: "paragraph",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id pellentesque ut pellentesque varius amet mauris. Tempor, risus, congue gravida nulla tincidunt nec diam. Tincidunt magnis eu, vitae dictumst commodo dolor in. Aenean dictumst risus posuere a at id fermentum nibh. Luctus nunc bibendum duis egestas scelerisque.",
      },
      {
        type: "paragraph",
        content:
          "Maecenas in pharetra hendrerit neque, tellus eu. Arcu tempus, vel blandit adipiscing a sed cursus. Augue vestibulum tempus lectus gravida condimentum mauris iaculis.",
      },
      {
        type: "quote",
        content:
          "Tempor, risus, congue gravida nulla tincidunt nec diam. Tincidunt magnis eu, vitae dictumst commodo dolor in. Aenean dictumst risus posuere.",
      },
      {
        type: "paragraph",
        content:
          "Incidunt magnis eu, vitae dictumst commodo dolor in. Aenean dictumst risus posuere a at id fermentum nibh. Luctus nunc bibendum duis egestas scelerisque.",
      },
      {
        type: "list-heading",
        content: "Follow the list below:",
      },
      {
        type: "paragraph",
        content:
          "Tempor, risus, congue gravida nulla tincidunt nec diam. Tincidunt magnis eu, vitae dictumst commodo dolor in. Aenean dictumst risus posuere a at id fermentum nibh. Luctus nunc bibendum duis egestas.",
      },
    ],
  }

  return (
    <div className="bg-[#f3f2f2]">
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Post Header */}
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <div className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-4">POSTS</div>
                <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
              </div>
              <div className="flex flex-col items-center">
                <Avatar src={post.author.avatar} alt={post.author.name} size="lg" className="mb-2" />
                <h3 className="font-bold text-center">{post.author.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{post.author.location}</p>
                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winstonblair__Copy_-oshtPoDM6wx75nxNwg1QXDr9S4rLPG.png"
              alt="Town hall meeting"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="p-6 md:p-8">
            <div className="prose max-w-none">
              {post.content.map((block, index) => {
                switch (block.type) {
                  case "heading":
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                        {block.content}
                      </h2>
                    )
                  case "paragraph":
                    return (
                      <p key={index} className="mb-4 text-gray-700">
                        {block.content}
                      </p>
                    )
                  case "quote":
                    return (
                      <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-6">
                        <p className="text-gray-700">{block.content}</p>
                      </blockquote>
                    )
                  case "list-heading":
                    return (
                      <h3 key={index} className="font-bold mt-6 mb-2">
                        {block.content}
                      </h3>
                    )
                  default:
                    return null
                }
              })}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
