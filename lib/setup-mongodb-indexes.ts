import clientPromise from "./mongodb";

// Add this at the top of the file, after the imports
if (typeof window !== "undefined") {
  throw new Error("This module can only be used on the server side");
}

/**
 * This script sets up text indexes on MongoDB collections for search functionality
 */
export async function setupMongoDBIndexes() {
  try {
    console.log("Setting up MongoDB text indexes...");
    const client = await clientPromise;
    const db = client.db("humanity");

    // Create text index on questions collection
    await db.collection("questions").createIndex(
      {
        title: "text",
        description: "text",
      },
      {
        name: "questions_text_index",
        weights: {
          title: 10,
          description: 5,
        },
      }
    );
    console.log("Created text index on questions collection");

    // Create text index on answers collection
    await db.collection("answers").createIndex(
      {
        title: "text",
        summary: "text",
        content: "text",
      },
      {
        name: "answers_text_index",
        weights: {
          title: 10,
          summary: 5,
          content: 3,
        },
      }
    );
    console.log("Created text index on answers collection");

    // Create text index on author_profiles collection
    await db.collection("author_profiles").createIndex(
      {
        bio: "text",
        countryOfResidence: "text",
      },
      {
        name: "author_profiles_text_index",
      }
    );
    console.log("Created text index on author_profiles collection");

    // Create text index on users collection for author names
    await db.collection("users").createIndex(
      {
        firstName: "text",
        lastName: "text",
      },
      {
        name: "users_text_index",
      }
    );
    console.log("Created text index on users collection");

    console.log("All MongoDB text indexes have been set up successfully");
    return { success: true };
  } catch (error) {
    console.error("Error setting up MongoDB text indexes:", error);
    return { success: false, error };
  }
}
