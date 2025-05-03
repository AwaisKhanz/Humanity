import { type NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({
        results: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }

    const db = await getMongoDb();
    const results = [];
    let total = 0;
    let totalPages = 0;

    // Create a text search query
    const textSearchQuery = { $text: { $search: query } };

    // Helper function to check if a collection exists
    async function collectionExists(collectionName: string): Promise<boolean> {
      const collections = await db.listCollections().toArray();
      return collections.some((col) => col.name === collectionName);
    }

    // Search questions if no type filter or type is "question"
    if (!type || type === "question") {
      let questions = [];
      if (await collectionExists("questions")) {
        questions = await db
          .collection("questions")
          .find(textSearchQuery)
          .project({
            _id: 1,
            title: 1,
            description: 1,
            createdAt: 1,
            score: { $meta: "textScore" },
          })
          .sort({ score: { $meta: "textScore" } })
          .skip(type ? skip : 0)
          .limit(type ? limit : 5)
          .toArray();
      } else {
        console.warn("Collection 'questions' does not exist.");
      }

      const questionsCount =
        type === "question" && questions.length > 0
          ? await db.collection("questions").countDocuments(textSearchQuery)
          : questions.length;

      results.push(
        ...questions.map((q) => ({
          id: q._id.toString(),
          type: "question",
          title: q.title,
          description: q.description || "",
          url: `/questions/${q._id}`,
          score: q.score,
          createdAt: q.createdAt,
        }))
      );

      if (type === "question") {
        total = questionsCount;
        totalPages = Math.ceil(total / limit);
      }
    }

    // Search answers if no type filter or type is "answer"
    if (!type || type === "answer") {
      let answers = [];
      if (await collectionExists("answers")) {
        answers = await db
          .collection("answers")
          .aggregate([
            { $match: textSearchQuery },
            {
              $lookup: {
                from: "questions",
                localField: "questionId",
                foreignField: "_id",
                as: "question",
              },
            },
            {
              $unwind: { path: "$question", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                summary: 1,
                content: 1,
                createdAt: 1,
                questionId: 1,
                questionTitle: "$question.title",
                score: { $meta: "textScore" },
              },
            },
            { $sort: { score: { $meta: "textScore" } } },
            { $skip: type ? skip : 0 },
            { $limit: type ? limit : 5 },
          ])
          .toArray();
      } else {
        console.warn("Collection 'answers' does not exist.");
      }

      const answersCount =
        type === "answer" && answers.length > 0
          ? await db.collection("answers").countDocuments(textSearchQuery)
          : answers.length;

      results.push(
        ...answers.map((a) => ({
          id: a._id.toString(),
          type: "answer",
          title: a.title || "Answer",
          description: a.summary || a.content.substring(0, 150) + "...",
          url: `/questions/${a.questionId}/answers/${a._id}`,
          score: a.score,
          createdAt: a.createdAt,
          metadata: {
            questionTitle: a.questionTitle,
          },
        }))
      );

      if (type === "answer") {
        total = answersCount;
        totalPages = Math.ceil(total / limit);
      }
    }

    // Search author profiles if no type filter or type is "author"
    if (!type || type === "author") {
      let authorProfiles = [];
      if (await collectionExists("author_profiles")) {
        authorProfiles = await db
          .collection("author_profiles")
          .aggregate([
            { $match: textSearchQuery },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                bio: 1,
                expertise: 1,
                countryOfResidence: 1,
                profileImage: 1,
                createdAt: 1,
                firstName: "$user.firstName",
                lastName: "$user.lastName",
                slug: 1,
                score: { $meta: "textScore" },
              },
            },
            { $sort: { score: { $meta: "textScore" } } },
            { $skip: type ? skip : 0 },
            { $limit: type ? limit : 5 },
          ])
          .toArray();
      } else {
        console.warn("Collection 'author_profiles' does not exist.");
      }

      const authorsCount =
        type === "author" && authorProfiles.length > 0
          ? await db
              .collection("author_profiles")
              .countDocuments(textSearchQuery)
          : authorProfiles.length;

      results.push(
        ...authorProfiles.map((a) => ({
          id: a._id.toString(),
          type: "author",
          title: `${a.firstName} ${a.lastName}`,
          description: a.bio || "",
          url: `/authors/${a.slug || a._id}`,
          imageUrl: a.profileImage,
          score: a.score,
          createdAt: a.createdAt,
          metadata: {
            countryOfResidence: a.countryOfResidence,
            expertise: a.expertise,
          },
        }))
      );

      if (type === "author") {
        total = authorsCount;
        totalPages = Math.ceil(total / limit);
      }
    }

    // If no type filter, calculate total and sort by score
    if (!type) {
      results.sort((a, b) => b.score - a.score);
      total = results.length;
      totalPages = 1;
    }

    return NextResponse.json({
      results: results.slice(
        type ? 0 : skip,
        type ? results.length : skip + limit
      ),
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
