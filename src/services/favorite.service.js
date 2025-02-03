import { Favorite } from "../models/favorite.model.js";

export class FavoriteService {
  async toggleFavorite(user, productId) {
    const userId = user?._id;
    try {
      const isExist = await Favorite.findOne({
        userId,
        products: { $elemMatch: { productId } },
      });
      if (isExist) return await this.deleteFavorite(userId, productId);
      else return await this.createFavorite(userId, productId);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "failed to toggle favorite",
      };
    }
  }

  async createFavorite(userId, productId) {
    // Implement your favorite logic here
    try {
      const newFavorite = {
        userId,
        products: [{ productId, addedAt: Date.now() }],
      };
      const dbResponse =
        (await Favorite.findOneAndUpdate(
          { userId },
          { $push: { products: { productId, addedAt: Date.now() } } },
          { new: true }
        )) || (await Favorite.create(newFavorite));
      return dbResponse
        ? {
            success: true,
            favorites: dbResponse,
            message: "success to create favorite",
          }
        : {
            success: false,
            error: true,
            error_message: "failed to create favorite",
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "failed to create favorite",
      };
    }
  }

  async getFavoritesByUserId(user) {
    const userId = user?._id;
    // Implement your favorite logic here
    try {
      const dbResponse = await Favorite.findOne({ userId });
      return dbResponse
        ? {
            success: true,
            message: "success to get favorites",
            favorites: dbResponse,
          }
        : {
            success: false,
            error: true,
            error_message: "favorite not found",
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "failed to get favorites",
      };
    }
  }

  async deleteFavorite(userId, productId) {
    // Implement your favorite logic here
    try {
      const dbResponse = await Favorite.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true }
      );
      return dbResponse
        ? {
            success: true,
            favorites: dbResponse,
            message: "success to delete favorite",
          }
        : {
            success: false,
            error: true,
            error_message: "favorite not found or not deleted",
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "failed to delete favorite",
      };
    }
  }
}
