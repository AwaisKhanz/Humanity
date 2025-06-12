// Add this at the top of the file, after the imports
if (typeof window !== "undefined") {
  throw new Error("This module can only be used on the server side");
}

import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import {
  Answer,
  AuthorProfile,
  Job,
  JobStatus,
  JobType,
  Question,
  User,
} from "./types";

// Export types from types.ts
export { UserRole, JobType, JobStatus } from "./types";
export type { User, Question, Answer, AuthorProfile, Job, Like } from "./types";

// Database and collection names
const DB_NAME = "humanity";

const COLLECTIONS = {
  USERS: "users",
  QUESTIONS: "questions",
  ANSWERS: "answers",
  AUTHOR_PROFILES: "author_profiles",
  JOBS: "jobs",
  LIKES: "likes",
};

// Database service class
class DatabaseService {
  private client: Promise<any>;

  constructor() {
    this.client = clientPromise;
  }

  // Get database instance
  private async getDb() {
    const client = await this.client;
    return client.db(DB_NAME);
  }

  // User methods
  async getUserByEmail(email: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.USERS).findOne({ email });
  }

  async getUserById(id: string | ObjectId) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) });
  }

  async createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb();
    const now = new Date();
    const newUser = {
      ...user,
      isAuthor: false,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  async updateUser(id: string | ObjectId, update: Partial<User>) {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...update,
          updatedAt: now,
        },
      }
    );
    return result.modifiedCount > 0;
  }

  // Question methods
  async getQuestions() {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.QUESTIONS)
      .find()
      .sort({ number: 1 })
      .toArray();
  }

  async getQuestionById(id: string | ObjectId) {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.QUESTIONS)
      .findOne({ _id: new ObjectId(id) });
  }

  async createQuestion(
    question: Omit<Question, "_id" | "createdAt" | "updatedAt">
  ) {
    const db = await this.getDb();
    const now = new Date();
    const newQuestion = {
      ...question,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db
      .collection(COLLECTIONS.QUESTIONS)
      .insertOne(newQuestion);
    return { ...newQuestion, _id: result.insertedId };
  }

  // Answer methods
  async getAnswersByQuestionId(questionId: string | ObjectId) {
    const db = await this.getDb();

    return db
      .collection(COLLECTIONS.ANSWERS)
      .find({
        questionId: new ObjectId(questionId),
        status: JobStatus.APPROVED,
      })
      .sort({ likes: -1 })
      .toArray();
  }

  async getAnswerById(id: string | ObjectId) {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.ANSWERS)
      .findOne({ _id: new ObjectId(id) });
  }

  async createAnswer(
    answer: Omit<Answer, "_id" | "likes" | "createdAt" | "updatedAt">
  ) {
    const db = await this.getDb();
    const now = new Date();
    const newAnswer = {
      ...answer,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db
      .collection(COLLECTIONS.ANSWERS)
      .insertOne(newAnswer);
    return { ...newAnswer, _id: result.insertedId };
  }

  async updateAnswerStatus(id: string | ObjectId, status: JobStatus) {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection(COLLECTIONS.ANSWERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: now,
        },
      }
    );
    return result.modifiedCount > 0;
  }

  // Get all authors with their profiles
  async getAllAuthors() {
    const db = await this.getDb();

    // First get all users who are authors
    const users = await db
      .collection(COLLECTIONS.USERS)
      .find({ isAuthor: true })
      .toArray();

    console.log(`Found ${users.length} users with isAuthor=true`);

    if (!users.length) return [];

    // Then get their profiles
    const authorProfiles = await db
      .collection(COLLECTIONS.AUTHOR_PROFILES)
      .find({
        userId: { $in: users.map((user: User) => new ObjectId(user._id)) },
      })
      .toArray();

    console.log(`Found ${authorProfiles.length} author profiles`);

    // Combine the data
    return users.map((user: User) => {
      const profile = authorProfiles.find(
        (profile: AuthorProfile) =>
          profile.userId.toString() === user._id.toString()
      );

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: profile?.name || `${user.firstName} ${user.lastName}`,
        preNominals: profile?.preNominals || "",
        middleInitials: profile?.middleInitials || "",
        countryOfResidence: profile?.countryOfResidence || "",
        bio: profile?.bio || "",
        imageUrl: profile?.imageUrl || "",
      };
    });
  }

  // Author profile methods
  async getAuthorProfileByUserId(userId: string | ObjectId) {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.AUTHOR_PROFILES)
      .findOne({ userId: new ObjectId(userId) });
  }

  async getAuthorAnswers(userId: string | ObjectId) {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.ANSWERS)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
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
            questionId: 1,
            title: 1,
            summary: 1,
            content: 1,
            likes: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            question: {
              _id: "$question._id",
              number: "$question.number",
              title: "$question.title",
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
  }

  async createAuthorProfile(
    profile: Omit<AuthorProfile, "_id" | "createdAt" | "updatedAt">
  ) {
    const db = await this.getDb();
    const now = new Date();
    const newProfile = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db
      .collection(COLLECTIONS.AUTHOR_PROFILES)
      .insertOne(newProfile);
    return { ...newProfile, _id: result.insertedId };
  }
  async updateAuthorProfile(
    userId: string | ObjectId,
    update: Partial<AuthorProfile>
  ) {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection(COLLECTIONS.AUTHOR_PROFILES).updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          ...update,
          updatedAt: now,
        },
      }
    );
    return result.modifiedCount > 0;
  }

  // Job methods
  async getJobs(status?: JobStatus) {
    const db = await this.getDb();
    const query = status ? { status } : {};
    return db
      .collection(COLLECTIONS.JOBS)
      .aggregate([
        { $match: query },
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
            adminNo: 1,
            type: 1,
            status: 1,
            userId: 1,
            relatedId: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              $cond: {
                if: { $and: ["$user", "$user.firstName", "$user.lastName"] },
                then: {
                  firstName: "$user.firstName",
                  lastName: "$user.lastName",
                },
                else: null,
              },
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
  }

  async createJob(job: Omit<Job, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb();
    const now = new Date();
    const newJob = {
      ...job,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COLLECTIONS.JOBS).insertOne(newJob);
    return { ...newJob, _id: result.insertedId };
  }

  async updateJobStatus(id: string | ObjectId, status: JobStatus) {
    const db = await this.getDb();
    const now = new Date();

    // Update job status
    const result = await db.collection(COLLECTIONS.JOBS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: now,
        },
      }
    );

    // If job is approved and type is new_author, update user's isAuthor
    if (status === JobStatus.APPROVED) {
      const job = await db
        .collection(COLLECTIONS.JOBS)
        .findOne({ _id: new ObjectId(id) });
      if (job && job.type === JobType.NEW_AUTHOR) {
        await db.collection(COLLECTIONS.USERS).updateOne(
          { _id: new ObjectId(job.userId) },
          {
            $set: {
              isAuthor: true,
              updatedAt: now,
            },
          }
        );
      }
    }

    return result.modifiedCount > 0;
  }

  async getJobById(jobId: string | ObjectId) {
    const db = await this.getDb();
    const job = await db
      .collection(COLLECTIONS.JOBS)
      .aggregate([
        { $match: { _id: new ObjectId(jobId) } },
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
            adminNo: 1,
            type: 1,
            status: 1,
            userId: 1,
            relatedId: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              $cond: {
                if: { $and: ["$user", "$user.firstName", "$user.lastName"] },
                then: {
                  firstName: "$user.firstName",
                  lastName: "$user.lastName",
                },
                else: null,
              },
            },
          },
        },
      ])
      .next();

    if (!job || !job.relatedId) {
      return job;
    }

    // Fetch related data based on job type
    let relatedData = null;
    if (
      job.type === JobType.NEW_AUTHOR ||
      job.type === JobType.PROFILE_UPDATE
    ) {
      relatedData = await db
        .collection(COLLECTIONS.AUTHOR_PROFILES)
        .findOne({ _id: new ObjectId(job.relatedId) });
    } else if (job.type === JobType.ANSWER_SUBMISSION) {
      const answer = await db
        .collection(COLLECTIONS.ANSWERS)
        .aggregate([
          { $match: { _id: new ObjectId(job.relatedId) } },
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
              likes: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              question: {
                _id: "$question._id",
                number: "$question.number",
                title: "$question.title",
              },
            },
          },
        ])
        .next();
      relatedData = answer;
    }

    return {
      ...job,
      relatedData,
    };
  }

  // Like methods
  async likeAnswer(userId: string | ObjectId, answerId: string | ObjectId) {
    const db = await this.getDb();
    const now = new Date();

    // Check if the user already liked this answer
    const existingLike = await db.collection(COLLECTIONS.LIKES).findOne({
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
    });

    if (existingLike) {
      return false;
    }

    // Create the like
    const like = {
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
      createdAt: now,
    };

    await db.collection(COLLECTIONS.LIKES).insertOne(like);

    // Increment the likes count on the answer
    await db
      .collection(COLLECTIONS.ANSWERS)
      .updateOne({ _id: new ObjectId(answerId) }, { $inc: { likes: 1 } });

    return true;
  }

  async unlikeAnswer(userId: string | ObjectId, answerId: string | ObjectId) {
    const db = await this.getDb();

    // Find and delete the like
    const result = await db.collection(COLLECTIONS.LIKES).deleteOne({
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
    });

    if (result.deletedCount === 0) {
      return false;
    }

    // Decrement the likes count on the answer
    await db
      .collection(COLLECTIONS.ANSWERS)
      .updateOne({ _id: new ObjectId(answerId) }, { $inc: { likes: -1 } });

    return true;
  }

  async getUserLikes(userId: string | ObjectId) {
    const db = await this.getDb();
    return db
      .collection(COLLECTIONS.LIKES)
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }
}

// Export a singleton instance
export const dbService = new DatabaseService();
