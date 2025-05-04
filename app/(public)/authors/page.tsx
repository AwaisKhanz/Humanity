import { AuthorsSearch } from "@/components/authors/authors-search";
import { getAllAuthors } from "@/lib/author-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Authors | Humanity",
  description:
    "Meet the experts and thought leaders who contribute their insights and perspectives to our questions about humanity's future.",
  openGraph: {
    title: "Our Authors | Humanity",
    description:
      "Meet the experts and thought leaders who contribute their insights and perspectives to our questions about humanity's future.",
  },
};

export default async function AuthorsPage() {
  
  const authors = await getAllAuthors();

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Authors</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the experts and thought leaders who contribute their insights
            and perspectives to our questions about humanity's future.
          </p>
        </div>

        <AuthorsSearch authors={authors} />
      </div>
    </div>
  );
}
