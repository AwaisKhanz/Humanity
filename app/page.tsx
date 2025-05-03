import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { routes } from "./routes"
import { FeaturedAuthors } from "@/components/home/featured-authors"

export default async function HomePage() {
  // Fetch featured authors (3 most recent approved authors)
  const db = await (await import("@/lib/mongodb")).default
  const users = await db.db().collection("users").find({ isAuthor: true }).sort({ createdAt: -1 }).limit(3).toArray()

  // Fetch author profiles
  const authorProfiles = users.length
    ? await db
        .db()
        .collection("author_profiles")
        .find({ userId: { $in: users.map((user) => user._id) } })
        .toArray()
    : []

  // Combine user and profile data
  const authors = users.map((user) => {
    const profile = authorProfiles.find((profile) => profile.userId.toString() === user._id.toString())
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      preNominals: profile?.preNominals || "",
      middleInitials: profile?.middleInitials || "",
      countryOfResidence: profile?.countryOfResidence || "",
      bio: profile?.bio || "",
      imageUrl: profile?.imageUrl || "",
    }
  })

  const featuredPosts = [
    {
      id: "1",
      title: "How to write content about your photographs",
      slug: "how-to-write-content-about-your-photographs",
      image: "/placeholder.svg?height=300&width=300",
      author: {
        name: "Dr Piers Robinson",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "22 Jan 2025",
      },
    },
    {
      id: "2",
      title: "How to write content about your photographs",
      slug: "how-to-write-content-about-your-photographs-2",
      image: "/placeholder.svg?height=300&width=300",
      author: {
        name: "Dr Niall McCrae",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "01 Feb 2025",
      },
    },
    {
      id: "3",
      title: "How to write content about your photographs",
      slug: "how-to-write-content-about-your-photographs-3",
      image: "/placeholder.svg?height=300&width=300",
      author: {
        name: "David Fleming",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "24 Jan 2022",
      },
    },
    {
      id: "4",
      title: "How to write content about your photographs",
      slug: "how-to-write-content-about-your-photographs-4",
      image: "/placeholder.svg?height=300&width=300",
      author: {
        name: "Steven Fleming",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "30 Jan 2022",
      },
    },
  ]

  return (
    <div className="bg-[#f3f2f2]">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">LET'S GET HUMANITY BACK ON TRACK</h1>
              <p className="text-gray-600">
                Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id porta quam quased tortor vitae sem
                finibus pharetra vitae eget sem. Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
                ante.
              </p>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winstonblair__Copy_.png-IqXQsf3X9yAmznIpXYgq2Ia8SYxePz.jpeg"
                alt="Earth from space"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What are we doing Section */}
      <section className="bg-white mt-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="People collaborating"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">What are we doing?</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id porta quam quased tortor vitae sem
                  finibus pharetra vitae eget sem. Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
                  ante.
                </p>
                <p className="text-gray-600">
                  Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id porta quam quased tortor vitae sem
                  finibus pharetra vitae eget sem. Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
                  ante.
                </p>
              </div>
              <div className="mt-6">
                <Link href={routes.whatAreWeDoing}>
                  <Button className="rounded-full">See More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Question 1 Section */}
      <section className="bg-white mt-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold uppercase mb-2">QUESTION 1</h2>
              <h3 className="text-4xl font-bold mb-4">Is humanity on the right track?</h3>
              <p className="text-gray-600 mb-6">
                Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id porta quam quased tortor vitae sem
                finibus pharetra vitae eget sem. Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
                ante.
              </p>
              <p className="text-gray-600 mb-6">
                Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id porta quam quased tortor vitae sem
                finibus pharetra vitae eget sem.
              </p>
              <Link href={routes.questions.answer("1")}>
                <Button variant="outline" className="rounded-full">
                  Submit your answer here
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=500&width=400"
                alt="Question 1"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Authors Section */}
      {authors.length > 0 && <FeaturedAuthors authors={authors} />}

      {/* Featured Posts Section */}
      <section className="bg-white mt-8">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPosts.map((post) => (
              <Link href={`${routes.news.post(post.slug)}`} key={post.id}>
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit quam auctor fermentum...
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-xs font-medium">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{post.author.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Answer CTA */}
      <section className="bg-white mt-8 pb-12">
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Link href={routes.questions.answer("1")}>
            <Button className="rounded-full">Submit your answer</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
