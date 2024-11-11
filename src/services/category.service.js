import { Category } from "../models/category.model.js";

export class CategoryService {
  async getAllCategories() {
    try {
      // Fetch all categories from the database
      const categories = await Category.find().lean(); // Using lean() for faster read-only operations

      // Handle the case when no categories are found
      if (!categories || categories.length === 0) {
        console.warn("[Warning]: No categories found in the database.");
        return { success: false, message: "No categories found", data: [] };
      }
      return {
        success: true,
        message: "Categories fetched successfully",
        categories,
      };
    } catch (error) {
      // Structured error handling for predictable error codes and logging
      console.error("[Error]: Failed to fetch categories:", {
        message: error.message,
        stack: error.stack,
        code: error.code || "UNKNOWN_ERROR",
      });

      // Respond with a consistent structure and specific error message
      throw new Error(
        "Failed to retrieve categories. Please contact support if the issue persists."
      );
    }
  }
}
