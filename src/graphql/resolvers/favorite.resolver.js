import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { FavoriteService } from "../../services/favorite.service.js";

const favoriteService = new FavoriteService();

export const favoriteResolvers = {
  Query: {
    getFavorites: authMiddleware.protect(
      async (_, __, { user }) =>
        await favoriteService.getFavoritesByUserId(user)
    ),
  },
  Mutation: {
    toggleFavorite: authMiddleware.protect(
      async (_, { productId }, { user }) =>
        await favoriteService.toggleFavorite(user, productId)
    ),
  },
};
