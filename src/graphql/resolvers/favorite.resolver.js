import { FavoriteService } from "../../services/favorite.service.js";

const favoriteService = new FavoriteService();

export const favoriteResolvers = {
  Query: {
    getFavoritesByUserId: async (_, { userId }) =>
      await favoriteService.getFavoritesByUserId(userId),
  },
  Mutation: {
    toggleFavorite: async (_, { userId, productId }) =>
      await favoriteService.toggleFavorite(userId, productId),
  },
};
