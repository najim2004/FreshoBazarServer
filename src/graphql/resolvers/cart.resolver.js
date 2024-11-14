import { CartService } from "../../services/cart.service.js";

const cartService = new CartService();

export const cartResolvers = {
  Query: {
    getCart: async (_, { userId }) => await cartService.getCart(userId),
  },
  Mutation: {
    addItemToCart: async (_, { userId, item }) =>
      await cartService.addItemToCart(userId, item),
    updateCartItem: async (_, { userId, productId }) =>
      await cartService.updateCartItem(userId, productId),
    removeItemFromCart: async (_, { userId, productId }) =>
      await cartService.removeItemFromCart(userId, productId),
    clearCart: async (_, { userId }) => await cartService.clearCart(userId),
  },
};
