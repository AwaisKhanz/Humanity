"use server";

import { getMongoDb } from "./mongodb";
import { ObjectId } from "mongodb";
import { JobStatus } from "./db-service";
import { dbService } from "@/lib/db-service";

// Search functionality
export async function searchContent(
  query: string,
  type?: string,
  page = 1,
  limit = 10
) {
  try {
    if (!query) {
      return { results: [], total: 0, page, limit, totalPages: 0 };
    }

    const db = await getMongoDb();
    const skip = (page - 1) * limit;
    const results = [];
    let total = 0;
    let totalPages = 0;

    // Create a text search query
    const textSearchQuery = { $text: { $search: query } };

    // Search questions if no type filter or type is "question"
    if (!type || type === "question") {
      const questions = await db
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

      const questionsCount =
        type === "question"
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
      const answers = await db
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
          { $unwind: { path: "$question", preserveNullAndEmptyArrays: true } },
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

      const answersCount =
        type === "answer"
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
      const authorProfiles = await db
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

      const authorsCount =
        type === "author"
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

    return {
      results: results.slice(
        type ? 0 : skip,
        type ? results.length : skip + limit
      ),
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Failed to perform search");
  }
}

// Get questions
export async function getQuestions() {
  try {
    const db = await getMongoDb();
    return await db
      .collection("questions")
      .find()
      .sort({ number: 1 })
      .toArray();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
}

// Get question by ID
export async function getQuestionById(id: string) {
  try {
    const db = await getMongoDb();
    return await db.collection("questions").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error fetching question:", error);
    throw new Error("Failed to fetch question");
  }
}

// Get answers for a question
export async function getAnswersByQuestionId(questionId: string) {
  try {
    const db = await getMongoDb();
    return await db
      .collection("answers")
      .find({
        questionId: new ObjectId(questionId),
        status: JobStatus.APPROVED,
      })
      .sort({ likes: -1 })
      .toArray();
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw new Error("Failed to fetch answers");
  }
}

// Get author profiles
export async function getAuthorProfiles(page = 1, limit = 10) {
  try {
    const db = await getMongoDb();
    const skip = (page - 1) * limit;

    const profiles = await db
      .collection("author_profiles")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: 1,
            bio: 1,
            countryOfResidence: 1,
            imageUrl: 1,
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    const total = await db.collection("author_profiles").countDocuments();

    return {
      profiles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching author profiles:", error);
    throw new Error("Failed to fetch author profiles");
  }
}

// Get author profile by ID
export async function getAuthorProfileById(id: string) {
  try {
    const db = await getMongoDb();

    const profile = await db
      .collection("author_profiles")
      .aggregate([
        { $match: { userId: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: 1,
            bio: 1,
            countryOfResidence: 1,
            imageUrl: 1,
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            createdAt: 1,
          },
        },
      ])
      .toArray();

    return profile[0] || null;
  } catch (error) {
    console.error("Error fetching author profile:", error);
    throw new Error("Failed to fetch author profile");
  }
}

// Get jobs
export async function getJobs(status?: JobStatus) {
  try {
    const db = await getMongoDb();
    const query = status ? { status } : {};
    return await db
      .collection("jobs")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs");
  }
}

// Get job by ID
export async function getJobById(id: string) {
  try {
    const db = await getMongoDb();
    return await db.collection("jobs").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error fetching job:", error);
    throw new Error("Failed to fetch job");
  }
}

// Get users
export async function getUsers() {
  try {
    const db = await getMongoDb();
    return await db
      .collection("users")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Function to get user role by ID
export async function getUserRoleById(userId: string) {
  try {
    const user = await dbService.getUserById(userId);
    return user?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

// Function to check if user is an author
export async function isUserAuthor(userId: string) {
  try {
    const user = await dbService.getUserById(userId);
    return user?.isAuthor || false;
  } catch (error) {
    console.error("Error checking if user is author:", error);
    return false;
  }
}

// Function to get pending jobs count
export async function getPendingJobsCount() {
  try {
    const jobs = await dbService.getJobs(JobStatus.PENDING);
    return jobs.length;
  } catch (error) {
    console.error("Error fetching pending jobs count:", error);
    return 0;
  }
}

// Add more server actions as needed for your application
// These functions can be imported in server components or API routes
