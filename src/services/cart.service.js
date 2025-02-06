import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ERROR_CODES } from "../utils/constants.js";

export class CartService {
  createResponse(success, message, cart = null, error = null) {
    return { success, message, cart, error };
  }
  /**
   * Executes a database transaction with proper error handling
   */
  async executeTransaction(operation, successMessage) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await operation(session);
      await session.commitTransaction();
      return this.createResponse(true, successMessage, cart);
    } catch (error) {
      await session.abortTransaction();
      return this.createResponse(false, error.message, null, {
        code: error.code || ERROR_CODES.DATABASE_ERROR,
        details: error.details || {},
      });
    } finally {
      session.endSession();
    }
  }

  /**
   * Enriches cart items with product details
   */
  async enrichCartItems(items) {
    if (!items?.length) return [];

    const productIds = items.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id title price discountValue thumbnail")
      .lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    return items.map((item) => ({
      ...item,
      name: productMap.get(item.product_id.toString())?.title || "",
      price: productMap.get(item.product_id.toString())?.price || 0,
      discount_value:
        productMap.get(item.product_id.toString())?.discountValue || 0,
      thumbnail:
        productMap.get(item.product_id.toString())?.thumbnail?.url || "",
    }));
  }

  /**
   * Calculates cart totals
   */
  calculateCartTotals(items) {
    return items.reduce(
      (acc, { price = 0, quantity }) => ({
        total_price: acc.total_price + price * quantity,
        total_quantity: acc.total_quantity + quantity,
      }),
      { total_price: 0, total_quantity: 0 }
    );
  }

  /**
   * Retrieves or creates a cart for a user
   */
  async getCart(user_id) {
    try {
      const cart =
        (await Cart.findOne({ user_id }).lean()) ||
        (await Cart.create({ user_id }));

      if (!cart.items?.length) {
        return this.createResponse(true, "Cart is empty", {
          ...cart,
          total_price: 0,
          total_quantity: 0,
        });
      }
      console.log("90");
      const enrichedItems = await this.enrichCartItems(cart.items);
      const totals = this.calculateCartTotals(enrichedItems);
      const enrichedCart = {
        ...cart,
        items: enrichedItems,
        ...totals,
      };

      return this.createResponse(
        true,
        "Cart retrieved successfully",
        enrichedCart
      );
    } catch (error) {
      return this.createResponse(false, "Failed to retrieve cart", null, {
        code: ERROR_CODES.DATABASE_ERROR,
        details: { error: error.message },
      });
    }
  }

  /**
   * Adds an item to the cart
   */
  async addItemToCart(user_id, { product_id, quantity }) {
    if (!quantity || quantity <= 0) {
      return this.createResponse(false, "Invalid quantity", null, {
        code: ERROR_CODES.INVALID_QUANTITY,
        details: { minimum: 1 },
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return this.createResponse(false, "Product not found", null, {
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        details: { product_id },
      });
    }

    return this.executeTransaction(async (session) => {
      const existingCart = await Cart.findOneAndUpdate(
        { user_id: user_id, "items.product_id": product_id },
        { $inc: { "items.$.quantity": quantity } },
        { new: true }
      );

      if (!existingCart) {
        await Cart.findOneAndUpdate(
          { user_id: user_id },
          { $push: { items: { product_id, quantity } } },
          { new: true, session }
        );
      }

      return (await this.getCart(user_id)).cart;
    }, "Item added to cart successfully");
  }

  /**
   * Updates the quantity of an item in the cart
   */
  async updateCartItem(user_id, { productId, quantity }) {
    if (quantity < 0) {
      return this.createResponse(false, "Invalid quantity", null, {
        code: ERROR_CODES.INVALID_QUANTITY,
        details: { minimum: 0 },
      });
    }

    return this.executeTransaction(async (session) => {
      const update =
        quantity === 0
          ? { $pull: { items: { product_id: productId } } }
          : { $set: { "items.$.quantity": quantity } };

      const cart = await Cart.findOneAndUpdate(
        { user_id: user_id, "items.product_id": productId },
        update,
        { new: true, session }
      );

      if (!cart) {
        throw { code: ERROR_CODES.ITEM_NOT_FOUND, message: "Item not found" };
      }

      return (await this.getCart(user_id)).cart;
    }, "Cart updated successfully");
  }

  /**
   * Removes an item from the cart
   */
  async removeItemFromCart(user_id, productId) {
    return this.executeTransaction(async (session) => {
      const cart = await Cart.findOneAndUpdate(
        { user_id: user_id },
        { $pull: { items: { product_id: productId } } },
        { new: true, session }
      );

      if (!cart) {
        throw { code: ERROR_CODES.ITEM_NOT_FOUND, message: "Item not found" };
      }

      return (await this.getCart(user_id)).cart;
    }, "Item removed successfully");
  }

  /**
   * Clears all items from the cart
   */
  async clearCart(user_id) {
    return this.executeTransaction(async (session) => {
      const cart = await Cart.findOneAndUpdate(
        { user_id: user_id, "items.0": { $exists: true } },
        { $set: { items: [] } },
        { new: true, session }
      );

      if (!cart) {
        throw {
          code: ERROR_CODES.CART_EMPTY,
          message: "Cart is already empty",
        };
      }

      return (await this.getCart(user_id)).cart;
    }, "Cart cleared successfully");
  }
}
