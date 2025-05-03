import { AuthorsSearch } from "@/components/authors/authors-search";
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
  // Fetch all approved authors
  const db = await (await import("@/lib/mongodb")).default;
  const users = await db
    .db()
    .collection("users")
    .find({ isAuthor: true })
    .toArray();

  // Fetch author profiles
  const authorProfiles = users.length
    ? await db
        .db()
        .collection("author_profiles")
        .find({ userId: { $in: users.map((user) => user._id) } })
        .toArray()
    : [];

  // Combine user and profile data
  const authors = users.map((user) => {
    const profile = authorProfiles.find(
      (profile) => profile.userId.toString() === user._id.toString()
    );
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      preNominals: profile?.preNominals || "",
      middleInitials: profile?.middleInitials || "",
      countryOfResidence: profile?.countryOfResidence || "",
      bio: profile?.bio || "",
      imageUrl: profile?.imageUrl || "",
    };
  });

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
