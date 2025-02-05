import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export class CartService {
  // Retrieve a user's cart
  async getCart(user_id) {
    try {
      const cart = await Cart.findOne({ user_id });

      return !cart
        ? {
            success: false,
            message: "Cart not found!",
            cart: null,
          }
        : {
            success: true,
            message: "Cart retrieved successfully.",
            cart: cart,
          };
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return {
        success: false,
        message: "Failed to retrieve cart.",
        cart: null,
      };
    }
  }

  // Add item to cart
  async addItemToCart(user_id, itemInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { productId, quantity, options } = itemInput;
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found.");
      }

      let cart = await Cart.findOne({ user_id });
      if (!cart) cart = new Cart({ user_id });

      // ডিসকাউন্ট হিসাব
      const discountAmount = (product.price * product.discountValue) / 100;
      const discountPrice = product.price - discountAmount;
      const itemTotalPrice = discountPrice * quantity;

      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].totalPrice += itemTotalPrice;
      } else {
        cart.items.push({
          productId,
          name: product.title,
          thumbnail: product.thumbnail,
          quantity,
          price: discountPrice, // ডিসকাউন্টের পর মূল্য ব্যবহার করা হচ্ছে
          totalPrice: itemTotalPrice,
          options,
        });
      }
      await cart.save({ session });
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Item added to cart.", cart };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error adding item to cart:", error);
      return {
        success: false,
        message: "Failed to add item to cart.",
        cart: null,
      };
    }
  }

  // Update a cart item
  async updateCartItem(user_id, itemInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { productId, quantity } = itemInput;

      const cart = await Cart.findOne({ user_id });
      if (!cart) {
        throw new Error("Cart not found for user with ID: " + user_id);
      }

      const item = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!item) {
        throw new Error(
          "Item with product ID " + productId + " not found in cart."
        );
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found with ID: " + productId);
      }

      // Check if quantity is valid
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }

      // Calculate discount and update item price
      const discountAmount = (product.price * product.discountValue) / 100;
      const discountPrice = product.price - discountAmount;
      item.price = discountPrice;
      item.quantity = quantity;
      item.totalPrice = discountPrice * quantity;

      // If quantity is 0 or less, remove item from cart
      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }

      await cart.save({ session });
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Cart item updated.", cart };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error updating cart item:", error);

      // Return the specific error message to the user
      return {
        success: false,
        message: error.message || "Failed to update cart item.",
        cart: null,
      };
    }
  }

  // Remove an item from the cart
  async removeItemFromCart(user_id, productId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Cart find with user_id
      const cart = await Cart.findOne({ user_id });
      if (!cart) {
        throw new Error(`Cart not found for user with ID: ${user_id}`);
      }

      // Find the item in cart
      const item = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (!item) {
        throw new Error(`Item with product ID ${productId} not found in cart.`);
      }

      // Remove item from cart
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );

      // Save the updated cart
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Item removed from cart.", cart };
    } catch (error) {
      // If any error occurs, rollback the transaction
      await session.abortTransaction();
      session.endSession();

      console.error("Error removing item from cart:", error);

      return {
        success: false,
        message: error.message || "Failed to remove item from cart.",
        cart: null,
      };
    }
  }

  // Clear all items from the cart
  async clearCart(user_id) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the cart by user_id
      const cart = await Cart.findOne({ user_id });
      if (!cart) {
        throw new Error(`Cart not found for user with ID: ${user_id}`);
      }

      // Clear the cart items, total quantity and total price
      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalPrice = 0;

      // Save the updated cart with the session
      await cart.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Cart cleared successfully.", cart };
    } catch (error) {
      // If there's an error, rollback the transaction
      await session.abortTransaction();
      session.endSession();

      console.error("Error clearing cart:", error);

      return {
        success: false,
        message: error.message || "Failed to clear cart.",
        cart: null,
      };
    }
  }
}
