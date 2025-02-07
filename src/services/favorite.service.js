import { Favorite } from "../models/favorite.model.js";
export class FavoriteService {
  async toggleFavorite(user_id, product_id) {
    try {
      const isExist = await Favorite.findOne({
        user_id,
        products: { $elemMatch: { product_id } },
      });
      if (isExist) return await this.deleteFavorite(user_id, product_id);
      else return await this.createFavorite(user_id, product_id);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        message: error.message || "failed to toggle favorite",
      };
    }
  }

  async createFavorite(user_id, product_id) {
    try {
      const dbResponse = await Favorite.findOneAndUpdate(
        { user_id },
        { $push: { products: { product_id, addedAt: Date.now() } } },
        { new: true, upsert: true }
      );
      return dbResponse
        ? {
            success: true,
            product_id,
            request: "add",
            message: "success to create favorite",
          }
        : {
            success: false,
            error: true,
            request: "add",
            message: "failed to create favorite",
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        message: error.message || "failed to create favorite",
      };
    }
  }

  async getUserFavorites(user_id) {
    const dbResponse = await Favorite.findOne({ user_id });
    return dbResponse;
  }

  async deleteFavorite(user_id, product_id) {
    try {
      const dbResponse = await Favorite.findOneAndUpdate(
        { user_id },
        { $pull: { products: { product_id } } },
        { new: true }
      );
      return dbResponse
        ? {
            success: true,
            product_id,
            message: "success to delete favorite",
            request: "delete",
          }
        : {
            success: false,
            error: true,
            request: "delete",
            message: "favorite not found or not deleted",
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        message: error.message || "failed to delete favorite",
      };
    }
  }
}
