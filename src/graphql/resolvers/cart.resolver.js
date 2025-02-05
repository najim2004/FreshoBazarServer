import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { CartService } from "../../services/cart.service.js";

const cartService = new CartService();

export const cartResolvers = {
  Query: {
    getCart: authMiddleware.protect(
      async (_, __, { user }) => await cartService.getCart(user?._id || "")
    ),
  },
  Mutation: {
    addItemToCart: authMiddleware.protect(
      async (_, { item }, { user }) =>
        await cartService.addItemToCart(user?._id || "", item)
    ),
    updateCartItem: authMiddleware.protect(
      async (_, { item }, { user }) =>
        await cartService.updateCartItem(user?._id || "", item)
    ),
    removeItemFromCart: authMiddleware.protect(
      async (_, { productId }, { user }) =>
        await cartService.removeItemFromCart(user?._id || "", productId)
    ),
    clearCart: authMiddleware.protect(
      async (_, __, { user }) => await cartService.clearCart(user?._id || "")
    ),
  },
};
