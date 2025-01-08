import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ImageService } from "./image.service.js";

const imageService = new ImageService();

export class ProductService {
  async createProduct(newProduct) {
    // Input validation schema
    const requiredFields = [
      "title",
      "description",
      "categoryId",
      "categoryName",
      "subCategories",
      "unitType",
      "unitSize",
      "stockSize",
      "price",
      "currency",
      "isDiscountable",
      "discountValue",
      "tags",
      "isAvailable",
    ];

    // Validate required fields
    const missingFields = requiredFields.filter((field) => !newProduct[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate images
    if (!newProduct.images || !Array.isArray(newProduct.images)) {
      throw new Error("Images must be an array");
    }

    const uploadedImages = [];
    const uploadedThumbnail = null;

    try {
      // Upload product images
      if (newProduct.images.length > 0) {
        for (const image of newProduct.images) {
          try {
            const { url, public_id } = await imageService.uploadImage(image);
            uploadedImages.push({ id: public_id, url });
          } catch (uploadError) {
            throw new Error("Failed to upload one or more images");
          }
        }
      }

      // Handle thumbnail
      let thumbnailToSave;
      if (newProduct.thumbnail) {
        try {
          const { url, public_id } = await imageService.uploadImage(
            newProduct.thumbnail
          );
          thumbnailToSave = { id: public_id, url };
        } catch (thumbnailError) {
          throw new Error("Failed to upload thumbnail");
        }
      } else {
        // Use first image as thumbnail if no specific thumbnail provided
        thumbnailToSave = uploadedImages[0];
      }

      // Prepare product data for database
      const productData = {
        ...newProduct,
        images: uploadedImages,
        thumbnail: thumbnailToSave,
      };

      // Start a mongoose session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Create product within a transaction
        const dbResponse = await Product.create([productData], { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return {
          success: true,
          message: "Product created successfully.",
          productId: dbResponse[0]._id,
        };
      } catch (dbError) {
        // Rollback transaction
        await session.abortTransaction();
        session.endSession();

        // Delete all uploaded images in case of database save failure
        await Promise.all(
          [
            ...uploadedImages.map((img) => imageService.deleteImage(img.id)),
            thumbnailToSave && imageService.deleteImage(thumbnailToSave.id),
          ].filter(Boolean)
        );

        throw new Error("Failed to save product to database");
      }
    } catch (error) {
      // Clean up any already uploaded images in case of earlier errors
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((img) => imageService.deleteImage(img.id))
        );
      }
      if (uploadedThumbnail) {
        await imageService.deleteImage(uploadedThumbnail.id);
      }
      console.log(error);
      return {
        success: false,
        error: true,
        errorMessage: error.message || "Failed to create product",
      };
    }
  }
  async getAllProducts() {
    try {
      const dbResponse = await Product.find();
      if (!dbResponse || dbResponse.length === 0) {
        return {
          success: false,
          error: true,
          errorMessage: "No products found.",
        };
      }
      return {
        success: true,
        message: "Products retrieved successfully.",
        products: dbResponse,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: true,
        errorMessage: error.message || "Failed to retrieve products.",
      };
    }
  }

  async getProductById(_id) {
    console.log(_id);
    if (!_id) {
      return {
        success: false,
        error: true,
        errorMessage: "Product ID is required.",
      };
    }

    try {
      const dbResponse = await Product.findById(_id);
      if (!dbResponse) {
        return {
          success: false,
          error: true,
          errorMessage: "Product not found.",
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
        errorMessage: error.message || "Failed to retrieve product.",
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
          errorMessage: "Failed to delete product.",
        };
      }
      return { success: true, message: "Product deleted successfully." };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: true,
        errorMessage: error.message || "Failed to delete product.",
      };
    }
  }
}
