import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ERROR_CODES } from "../utils/constants.js";

export class CartService {
  async executeTransaction(operation) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findProducts(productIds, session) {
    return Product.find({ _id: { $in: productIds } })
      .select("_id title price discountValue thumbnail")
      .session(session)
      .lean();
  }

  createEnrichedItem(item, product = {}) {
    return {
      ...item,
      name: product.title || "",
      price: product.price || 0,
      discount_value: product.discountValue || 0,
      thumbnail: product.thumbnail?.url || "",
    };
  }

  async enrichCartItems(items = [], session) {
    if (!items.length) return [];

    const products = await this.findProducts(
      items.map((item) => item.product_id),
      session
    );
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    return items.map((item) =>
      this.createEnrichedItem(item, productMap.get(item.product_id.toString()))
    );
  }

  calculateCartTotals(items) {
    return items.reduce(
      (acc, { price = 0, quantity }) => ({
        total_price: acc.total_price + price * quantity,
        total_quantity: acc.total_quantity + quantity,
      }),
      { total_price: 0, total_quantity: 0 }
    );
  }

  async updateCartAndReturn(user_id, update, options = {}, session) {
    const cart = await Cart.findOneAndUpdate(
      { user_id, ...options.filter },
      update,
      { new: true, session, ...options }
    );

    if (!cart && options.requireCart) {
      throw {
        code: options.errorCode || ERROR_CODES.CART_NOT_FOUND,
        message: options.errorMessage || "Cart not found",
      };
    }

    return cart;
  }

  async getUpdatedCart(user_id, session) {
    const cart = await Cart.findOne({ user_id }).session(session).lean();
    if (!cart) return { items: [], total_price: 0, total_quantity: 0 };

    const enrichedItems = await this.enrichCartItems(cart.items, session);
    return {
      ...cart,
      items: enrichedItems,
      ...this.calculateCartTotals(enrichedItems),
    };
  }

  createSuccessResponse(message, cart) {
    return { success: true, message, cart };
  }

  async getCart(user_id) {
    try {
      const cart =
        (await Cart.findOne({ user_id }).lean()) ||
        (await Cart.create({ user_id }));

      const updatedCart = await this.getUpdatedCart(user_id);
      return this.createSuccessResponse(
        cart.items?.length ? "Cart retrieved successfully" : "Cart is empty",
        updatedCart
      );
    } catch (error) {
      throw {
        success: false,
        message: "Failed to retrieve cart",
        error: {
          code: ERROR_CODES.DATABASE_ERROR,
          details: { error: error.message },
        },
      };
    }
  }

  validateQuantity(quantity, minValue = 1) {
    if (!quantity || quantity < minValue) {
      throw {
        code: ERROR_CODES.INVALID_QUANTITY,
        message: "Invalid quantity",
        details: { minimum: minValue },
      };
    }
  }

  async addItemToCart(user_id, { product_id, quantity }) {
    this.validateQuantity(quantity);

    return this.executeTransaction(async (session) => {
      const product = await Product.findById(product_id).session(session);
      if (!product) {
        throw {
          code: ERROR_CODES.PRODUCT_NOT_FOUND,
          message: "Product not found",
          details: { product_id },
        };
      }

      (await this.updateCartAndReturn(
        user_id,
        { $inc: { "items.$.quantity": quantity } },
        { filter: { "items.product_id": product_id } },
        session
      )) ||
        (await this.updateCartAndReturn(
          user_id,
          { $push: { items: { product_id, quantity } } },
          { upsert: true },
          session
        ));

      const updatedCart = await this.getUpdatedCart(user_id, session);
      return this.createSuccessResponse(
        "Item added to cart successfully",
        updatedCart
      );
    });
  }

  async updateCartItem(user_id, { productId, quantity }) {
    this.validateQuantity(quantity, 0);

    return this.executeTransaction(async (session) => {
      const update =
        quantity === 0
          ? { $pull: { items: { product_id: productId } } }
          : { $set: { "items.$.quantity": quantity } };

      await this.updateCartAndReturn(
        user_id,
        update,
        {
          filter: { "items.product_id": productId },
          requireCart: true,
          errorCode: ERROR_CODES.ITEM_NOT_FOUND,
          errorMessage: "Item not found",
        },
        session
      );

      const updatedCart = await this.getUpdatedCart(user_id, session);
      return this.createSuccessResponse(
        "Cart updated successfully",
        updatedCart
      );
    });
  }

  async removeItemFromCart(user_id, productId) {
    return this.executeTransaction(async (session) => {
      await this.updateCartAndReturn(
        user_id,
        { $pull: { items: { product_id: productId } } },
        {
          requireCart: true,
          errorCode: ERROR_CODES.ITEM_NOT_FOUND,
          errorMessage: "Item not found",
        },
        session
      );

      const updatedCart = await this.getUpdatedCart(user_id, session);
      return this.createSuccessResponse(
        "Item removed successfully",
        updatedCart
      );
    });
  }

  async clearCart(user_id) {
    return this.executeTransaction(async (session) => {
      await this.updateCartAndReturn(
        user_id,
        { $set: { items: [] } },
        {
          filter: { "items.0": { $exists: true } },
          requireCart: true,
          errorCode: ERROR_CODES.CART_EMPTY,
          errorMessage: "Cart is already empty",
        },
        session
      );

      const updatedCart = await this.getUpdatedCart(user_id, session);
      return this.createSuccessResponse(
        "Cart cleared successfully",
        updatedCart
      );
    });
  }
}
