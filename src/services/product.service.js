import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ImageService } from "./image.service.js";
import { validateProduct } from "../utils/validators.js";
import { Favorite } from "../models/favorite.model.js";

const imageService = new ImageService();

export class ProductService {
  async createProduct(newProduct) {
    const validationErrors = validateProduct(newProduct);
    if (validationErrors) return validationErrors;
    let images = [],
      thumbnail;

    try {
      [images, thumbnail] = await Promise.all([
        Promise.all(
          newProduct.images.map((img) =>
            imageService
              .uploadImage(img)
              .then(({ url, public_id }) => ({ id: public_id, url }))
              .catch(() => null)
          )
        ).then((imgs) => imgs.filter(Boolean)),
        newProduct.thumbnail
          ? imageService
              .uploadImage(newProduct.thumbnail)
              .then(({ url, public_id }) => ({ id: public_id, url }))
          : null,
      ]);

      if (!images.length) throw new Error("Image upload failed");

      const session = await mongoose.startSession();
      const [product] = await session.withTransaction(() =>
        Product.create(
          [
            {
              ...newProduct,
              images,
              thumbnail: thumbnail || images[0],
            },
          ],
          { session }
        )
      );

      return { success: true, productId: product._id };
    } catch (error) {
      if (images.length || thumbnail) {
        await Promise.all(
          [...images, thumbnail]
            .filter(Boolean)
            .map((img) => imageService.deleteImage(img.id))
        );
      }
      return { success: false, error: true, error_message: error.message };
    }
  }

  async getAllProducts(input = {}, user = {}) {
    try {
      // Build query once
      const query = this.buildQuery(input);
      const sort = this.applySorting(input);
      const { page, limit, skip } = this.getPagination(input);

      // Create index for frequently queried fields
      await Product.collection.createIndex({ isDelete: 1, isAvailable: 1 });
      await Product.collection.createIndex({ title: "text", tags: "text" });

      // Use lean() for better performance and select only needed fields
      // const projection = {
      //   title: 1,
      //   price: 1,
      //   images: 1,
      //   thumbnail: 1,
      //   description: 1,
      //   categoryId: 1,
      //   subCategories: 1,
      //   isOrganic: 1,
      //   unitSize: 1,
      // };

      // Parallel execution for better performance
      const [products, total, userFavorites] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(limit).lean(),

        Product.countDocuments(query),
        user._id
          ? Favorite.findOne({ userId: user._id }).select("products").lean()
          : null,
      ]);

      // Use Map for O(1) lookup instead of includes
      const favoriteSet = userFavorites
        ? new Set(
            userFavorites.products.map((product) =>
              product?.productId.toString()
            )
          )
        : new Set();
      // Optimize product enhancement
      const enhancedProducts = products.map((product) => ({
        ...product,
        isFavorite: favoriteSet.has(product._id.toString()),
      }));

      return this.formatResponse(enhancedProducts, total, page, limit);
    } catch (error) {
      console.error("Product search error:", error);
      return this.errorResponse();
    }
  }

  buildQuery(input) {
    const query = { isDelete: false, isAvailable: true };
    // console.log(input);

    if (input.categoryId) query.categoryId = input.categoryId;
    if (input.subcategories?.length) {
      query.subCategories = {
        $in: Array.isArray(input.subcategories)
          ? input.subcategories
          : input.subcategories.split(","),
      };
    }
    if (input.search) {
      const regex = new RegExp(this.escapeRegex(input.search), "i");
      query.$or = [
        { title: regex },
        { tags: regex },
        { description: regex },
        { categoryName: regex },
        { subCategories: { $in: [regex] } },
      ];
    }
    if (input.dietaryOptions) {
      query.isOrganic = input.dietaryOptions === "organic";
    }
    if (input.priceRange?.length === 2) {
      const [min, max] = Array.isArray(input.priceRange)
        ? input.priceRange
        : input.priceRange.split(",");
      query.price = { $gte: Number(min), $lte: Number(max) };
    }

    return query;
  }
  // Helper method to apply sorting
  applySorting(input) {
    const sort = {};
    if (input.price) {
      sort.price = input.price === "highest_price" ? -1 : 1;
    }
    if (input.unitSize) {
      sort.unitSize = input.unitSize === "bigger_first" ? -1 : 1;
    }
    if (input.date) {
      sort.createdAt = input.date === "newest" ? -1 : 1;
    }
    // console.log(input?.otherOptions);
    if (input?.otherOptions?.includes("top-rated")) {
      sort.ratingsCount = -1;
    }
    // if(input.otherOptions.includes("most-popular")) {
    //   sort.sold = -1;
    // }
    if (input?.otherOptions?.includes("discount")) {
      sort.discountValue = -1;
    }
    if (input?.otherOptions?.includes("in-stock")) {
      sort.stockSize = -1;
    }

    // If no sort specified, default to newest first
    if (!sort.date) {
      sort.createdAt = -1;
    }
    return sort;
  }

  getPagination(input) {
    const page = Math.max(1, parseInt(input.page) || 1);
    const limit = Math.max(1, parseInt(input.limit) || 12);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  // Helper method to escape special regex characters
  escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  formatResponse(products, total, page, limit) {
    return products.length
      ? {
          success: true,
          message: "Products retrieved successfully.",
          products,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
        }
      : {
          success: false,
          error: true,
          error_message: "No products found.",
          products: [],
          pagination: { currentPage: page, totalPages: 0, totalItems: 0 },
        };
  }

  // Error response
  errorResponse() {
    return {
      success: false,
      error: true,
      error_message: "Failed to retrieve products.",
      products: [],
      pagination: { currentPage: 1, totalPages: 0, totalItems: 0 },
    };
  }

  calculateProductScore(product) {
    const { rating, sales, reviews, views, stock, discount } = product;

    // স্কোর ক্যালকুলেশন
    const ratingScore = rating * 10; // রেটিং (1-5) কে 10 গুণ করুন
    const salesScore = sales * 2; // প্রতিটি সেলের জন্য 2 পয়েন্ট
    const reviewScore = reviews * 1; // প্রতিটি রিভিউর জন্য 1 পয়েন্ট
    const viewScore = views * 0.1; // প্রতিটি ভিউর জন্য 0.1 পয়েন্ট
    const stockScore = stock > 0 ? 10 : 0; // স্টক থাকলে 10 পয়েন্ট
    const discountScore = discount ? 5 : 0; // ডিসকাউন্ট থাকলে 5 পয়েন্ট

    // মোট স্কোর
    const totalScore =
      ratingScore +
      salesScore +
      reviewScore +
      viewScore +
      stockScore +
      discountScore;

    return totalScore;
  }

  async getFeaturedProducts() {
    try {
      // ইন্ডেক্স তৈরি করুন (যদি প্রয়োজন হয়)
      await Product.collection.createIndex({ isDelete: 1, isAvailable: 1 });

      // Aggregate Pipeline
      const products = await Product.aggregate([
        {
          $match: {
            isDelete: false,
            isAvailable: true,
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                { $multiply: ["$averageRating", 10] }, // রেটিং স্কোর
                { $multiply: ["$sales", 2] }, // সেলস স্কোর
                { $multiply: ["$totalReviews", 1] }, // রিভিউ স্কোর
                { $multiply: ["$views", 0.1] }, // ভিউ স্কোর
                { $cond: [{ $gt: ["$stockSize", 0] }, 10, 0] }, // স্টক স্কোর
                { $cond: ["$discountValue", 5, 0] }, // ডিসকাউন্ট স্কোর
              ],
            },
          },
        },
        { $sort: { score: -1 } }, // স্কোর অনুযায়ী সর্ট
        { $limit: 12 }, // শীর্ষ 12 প্রোডাক্ট
      ]);

      return {
        success: true,
        message: "Featured products retrieved successfully.",
        products,
      };
    } catch (error) {
      console.error("Featured products error:", error);
      return {
        success: false,
        error: true,
        error_message: "Failed to retrieve featured products.",
        products: [],
      };
    }
  }

  async getProductById(_id) {
    if (!_id) {
      return {
        success: false,
        error: true,
        error_message: "Product ID is required.",
      };
    }

    try {
      const dbResponse = await Product.findByIdAndUpdate(
        _id,
        { $inc: { views: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      if (!dbResponse) {
        return {
          success: false,
          error: true,
          error_message: "Product not found.",
        };
      }
      return {
        success: true,
        message: "Product retrieved successfully.",
        product: dbResponse,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "Failed to retrieve product.",
      };
    }
  }

  async deleteProduct(id) {
    try {
      const dbResponse = await Product.findByIdAndDelete(id);
      if (!dbResponse) {
        return {
          success: false,
          error: true,
          error_message: "Failed to delete product.",
        };
      }
      return { success: true, message: "Product deleted successfully." };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: true,
        error_message: error.message || "Failed to delete product.",
      };
    }
  }
}
