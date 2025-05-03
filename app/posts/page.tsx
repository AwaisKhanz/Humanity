import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function PostsPage() {
  // In a real app, you would fetch posts from an API or database
  const posts = [
    {
      id: "1",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "David Fleming",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "2",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-2",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "Dr Niall McCrae",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-3",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "Dr Piers Robinson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-4",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "David Fleming",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "5",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-5",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "Dr Piers Robinson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "6",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-6",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "David Fleming",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "7",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-7",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "Dr Piers Robinson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "8",
      title: "Every town should discuss the questions freely",
      slug: "every-town-should-discuss-the-questions-freely-8",
      image: "/placeholder.svg?height=300&width=400",
      author: {
        name: "Dr Niall McCrae",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  return (
    <div className="bg-[#f3f2f2]">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 mb-12 text-center">
          <div className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full mb-4">POSTS</div>
          <h1 className="text-4xl font-bold mb-4">
            LATEST QUESTION REVIEWS,
            <br />
            NEWS & FEATURES
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-3">{post.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                      <span className="text-sm">{post.author.name}</span>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="rounded-full">
            Load more posts
          </Button>
        </div>
      </div>
    </div>
  )
}
