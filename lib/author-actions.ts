"use server";

import { dbService } from "./db-service";
import { ObjectId } from "mongodb";

// Get all approved authors with their profiles
export async function getAllAuthors() {
  try {
    // Get all users who are authors
    const users = await dbService.getAllAuthors();

    // Log for debugging
    console.log(`Found ${users.length} authors`);

    return users;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

// Get author by ID with profile and answers
export async function getAuthorById(authorId: string) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(authorId)) {
      return null;
    }

    // Get author data
    const author = await dbService.getAnswerById(authorId);
    if (!author) {
      return null;
    }

    // Get author's answers
    const answers = await dbService.getAuthorAnswers(authorId);

    return { author, answers };
  } catch (error) {
    console.error(`Error fetching author ${authorId}:`, error);
    return null;
  }
}
