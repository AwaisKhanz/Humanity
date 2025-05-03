import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Database and collection names
const DB_NAME = "humanity"
const COLLECTIONS = {
  USERS: "users",
  QUESTIONS: "questions",
  ANSWERS: "answers",
  AUTHOR_PROFILES: "author_profiles",
  JOBS: "jobs",
  LIKES: "likes",
}

// User roles
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

// Job types
export enum JobType {
  NEW_AUTHOR = "new_author",
  PROFILE_UPDATE = "profile_update",
  ANSWER_SUBMISSION = "answer_submission",
}

// Job status
export enum JobStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// User interface
export interface User {
  _id?: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  isAuthor: boolean
  createdAt: Date
  updatedAt: Date
}

// Question interface
export interface Question {
  _id?: ObjectId
  number: number
  title: string
  description: string
  imageUrl?: string
  videoUrl?: string
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

// Answer interface
export interface Answer {
  _id?: ObjectId
  questionId: ObjectId
  userId: ObjectId
  title?: string
  summary: string
  content: string
  likes: number
  status: JobStatus
  createdAt: Date
  updatedAt: Date
}

// Author profile interface
export interface AuthorProfile {
  _id?: ObjectId
  userId: ObjectId
  preNominals?: string
  middleInitials?: string
  countryOfResidence: string
  bio: string
  links: string[]
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Job interface
export interface Job {
  _id?: ObjectId
  adminNo: string
  type: JobType
  status: JobStatus
  userId: ObjectId
  relatedId?: ObjectId // ID of the related entity (answer, profile, etc.)
  createdAt: Date
  updatedAt: Date
}

// Like interface
export interface Like {
  _id?: ObjectId
  userId: ObjectId
  answerId: ObjectId
  createdAt: Date
}

// Database service class
class DatabaseService {
  private client: Promise<any>

  constructor() {
    this.client = clientPromise
  }

  // Get database instance
  private async getDb() {
    const client = await this.client
    return client.db(DB_NAME)
  }

  // User methods
  async getUserByEmail(email: string) {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.USERS).findOne({ email })
  }

  async getUserById(id: string | ObjectId) {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) })
  }

  async createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb()
    const now = new Date()
    const newUser = {
      ...user,
      isAuthor: false,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser)
    return { ...newUser, _id: result.insertedId }
  }

  async updateUser(id: string | ObjectId, update: Partial<User>) {
    const db = await this.getDb()
    const now = new Date()
    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...update,
          updatedAt: now,
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Question methods
  async getQuestions() {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.QUESTIONS).find().sort({ number: 1 }).toArray()
  }

  async getQuestionById(id: string | ObjectId) {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.QUESTIONS).findOne({ _id: new ObjectId(id) })
  }

  async createQuestion(question: Omit<Question, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb()
    const now = new Date()
    const newQuestion = {
      ...question,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTIONS.QUESTIONS).insertOne(newQuestion)
    return { ...newQuestion, _id: result.insertedId }
  }

  // Answer methods
  async getAnswersByQuestionId(questionId: string | ObjectId) {
    const db = await this.getDb()
    return db
      .collection(COLLECTIONS.ANSWERS)
      .find({ questionId: new ObjectId(questionId), status: JobStatus.APPROVED })
      .sort({ likes: -1 })
      .toArray()
  }

  async getAnswerById(id: string | ObjectId) {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.ANSWERS).findOne({ _id: new ObjectId(id) })
  }

  async createAnswer(answer: Omit<Answer, "_id" | "likes" | "createdAt" | "updatedAt">) {
    const db = await this.getDb()
    const now = new Date()
    const newAnswer = {
      ...answer,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTIONS.ANSWERS).insertOne(newAnswer)
    return { ...newAnswer, _id: result.insertedId }
  }

  async updateAnswerStatus(id: string | ObjectId, status: JobStatus) {
    const db = await this.getDb()
    const now = new Date()
    const result = await db.collection(COLLECTIONS.ANSWERS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: now,
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Author profile methods
  async getAuthorProfileByUserId(userId: string | ObjectId) {
    const db = await this.getDb()
    return db.collection(COLLECTIONS.AUTHOR_PROFILES).findOne({ userId: new ObjectId(userId) })
  }

  async createAuthorProfile(profile: Omit<AuthorProfile, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb()
    const now = new Date()
    const newProfile = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTIONS.AUTHOR_PROFILES).insertOne(newProfile)
    return { ...newProfile, _id: result.insertedId }
  }

  async updateAuthorProfile(userId: string | ObjectId, update: Partial<AuthorProfile>) {
    const db = await this.getDb()
    const now = new Date()
    const result = await db.collection(COLLECTIONS.AUTHOR_PROFILES).updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          ...update,
          updatedAt: now,
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Job methods
  async getJobs(status?: JobStatus) {
    const db = await this.getDb()
    const query = status ? { status } : {}
    return db.collection(COLLECTIONS.JOBS).find(query).sort({ createdAt: -1 }).toArray()
  }

  async createJob(job: Omit<Job, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.getDb()
    const now = new Date()
    const newJob = {
      ...job,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTIONS.JOBS).insertOne(newJob)
    return { ...newJob, _id: result.insertedId }
  }

  async updateJobStatus(id: string | ObjectId, status: JobStatus) {
    const db = await this.getDb()
    const now = new Date()
    const result = await db.collection(COLLECTIONS.JOBS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: now,
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Like methods
  async likeAnswer(userId: string | ObjectId, answerId: string | ObjectId) {
    const db = await this.getDb()
    const now = new Date()

    // Check if the user already liked this answer
    const existingLike = await db.collection(COLLECTIONS.LIKES).findOne({
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
    })

    if (existingLike) {
      return false
    }

    // Create the like
    const like = {
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
      createdAt: now,
    }

    await db.collection(COLLECTIONS.LIKES).insertOne(like)

    // Increment the likes count on the answer
    await db.collection(COLLECTIONS.ANSWERS).updateOne({ _id: new ObjectId(answerId) }, { $inc: { likes: 1 } })

    return true
  }

  async unlikeAnswer(userId: string | ObjectId, answerId: string | ObjectId) {
    const db = await this.getDb()

    // Find and delete the like
    const result = await db.collection(COLLECTIONS.LIKES).deleteOne({
      userId: new ObjectId(userId),
      answerId: new ObjectId(answerId),
    })

    if (result.deletedCount === 0) {
      return false
    }

    // Decrement the likes count on the answer
    await db.collection(COLLECTIONS.ANSWERS).updateOne({ _id: new ObjectId(answerId) }, { $inc: { likes: -1 } })

    return true
  }

  async getUserLikes(userId: string | ObjectId) {
    const db = await this.getDb()
    return db
      .collection(COLLECTIONS.LIKES)
      .find({ userId: new ObjectId(userId) })
      .toArray()
  }
}

// Export a singleton instance
export const dbService = new DatabaseService()
