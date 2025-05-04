import { MessageCircle, Users, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function QuestionsPage() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/questions`,
    {
      cache: "no-store",
    }
  );
  const questions = await response.json();

  const featuredQuestion = questions.length > 0 ? questions[0] : null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Humanity Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore thought-provoking questions about humanity's future. Read
            answers from experts and contribute your own perspective.
          </p>
        </div>

        {/* Featured Question */}
        {featuredQuestion && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-4">
              Featured Question
            </h2>
            <Link href={`/questions/${featuredQuestion._id}`} className="block">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-80 w-full">
                  <Image
                    src={
                      featuredQuestion.imageUrl ||
                      "/placeholder.svg?height=400&width=800&query=futuristic%20humanity"
                    }
                    alt={featuredQuestion.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <span className=" text-white  py-1 rounded-full text-sm font-medium inline-block mb-3">
                      Question {featuredQuestion.number}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {featuredQuestion.title}
                    </h3>
                    <p className="text-white/90 mb-4 line-clamp-2">
                      {featuredQuestion.description}
                    </p>
                    {/* <div className="flex items-center gap-6 text-white/80">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <span>12 Answers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Expert Contributors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Updated Recently</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Questions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-4">
            All Questions
          </h2>

          {questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((question: any) => (
                <Link
                  href={`/questions/${question._id}`}
                  key={question._id}
                  className="block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
                    <div className="relative h-48">
                      <Image
                        src={
                          question.imageUrl ||
                          `/placeholder.svg?height=200&width=400&query=question%20${question.number}`
                        }
                        alt={question.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          Question {question.number}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {question.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2 text-gray-500">
                          <MessageCircle size={16} />
                          <span className="text-sm">View Answers</span>
                        </div>
                        <div className="text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          <span className="text-sm font-medium">
                            View Question
                          </span>
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center shadow">
              <p className="text-gray-600">
                No questions available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
