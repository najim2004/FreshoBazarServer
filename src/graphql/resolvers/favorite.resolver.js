import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { FavoriteService } from "../../services/favorite.service.js";

const favoriteService = new FavoriteService();

export const favoriteResolvers = {
  Query: {
    getFavorites: authMiddleware.protect(
      async (_, __, { user }) =>
        await favoriteService.getUserFavorites(user?._id || "")
    ),
  },
  Mutation: {
    toggleFavorite: authMiddleware.protect(
      async (_, { product_id }, { user }) =>
        await favoriteService.toggleFavorite(user?.id, product_id)
    ),
  },
};
