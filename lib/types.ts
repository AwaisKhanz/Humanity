import { ObjectId } from "mongodb";

// User roles enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  AUTHOR = "author",
}

// Job types enum
export enum JobType {
  NEW_AUTHOR = "new_author",
  PROFILE_UPDATE = "profile_update",
  ANSWER_SUBMISSION = "answer_submission",
}

// Job status enum
export enum JobStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// User interface
export interface User {
  _id: string | ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Author profile interface
export interface AuthorProfile {
  _id: string | ObjectId;
  userId: string | ObjectId;
  preNominals?: string;
  middleInitials?: string;
  countryOfResidence: string;
  name: string;
  bio: string;
  links: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Question interface
export interface Question {
  _id: string | ObjectId;
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Answer interface
export interface Answer {
  _id: string;
  questionId: string | ObjectId;
  userId: string | ObjectId;
  title?: string;
  summary: string;
  content: string;
  links?: string[];
  likes: number;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Job interface
export interface Job {
  _id: string | ObjectId;
  adminNo: string;
  type: JobType;
  status: JobStatus;
  userId: string | ObjectId;
  relatedId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Like interface
export interface Like {
  _id: string | ObjectId;
  userId: string | ObjectId;
  answerId: string | ObjectId;
  createdAt: Date;
}
