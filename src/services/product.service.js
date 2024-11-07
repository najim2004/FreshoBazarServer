import { Product } from "../models/product.model.js";

export class ProductService {
  async createProduct(newProduct) {
    try {
      const dbResponse = await Product.create(newProduct);

      return !dbResponse
        ? {
            success: false,
            error: true,
            error_message: "failed to create",
          }
        : { success: true, message: "success to create registration" };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        error_message: "failed to create",
      };
    }
  }

  async getAllProducts() {
    try {
      const dbResponse = await Product.find();
      return dbResponse.length == 0 || !dbResponse
        ? {
            success: false,
            error: true,
            error_message: "failed to get products",
          }
        : { success: true, message: "success to get products" };
    } catch (error) {
      return {
        success: false,
        error: true,
        error_message: "failed to get products",
      };
    }
  }

  async getProductById(_id) {
    try {
      const dbResponse = await Product.findOne(_id);
      return !dbResponse
        ? {
            success: false,
            error: true,
            error_message: "failed to get product",
          }
        : { success: true, message: "success to get product" };
    } catch (error) {
      return {
        success: false,
        error: true,
        error_message: "failed to get product",
      };
    }
  }

  // updateProduct(_id) {
  //   const productIndex = this.products.findIndex(
  //     (product) => product._id === id
  //   );
  //   if (productIndex !== -1) {
  //     this.products[productIndex] = updatedProduct;
  //   }
  // }

  async deleteProduct(_id) {
    try {
      const dbResponse = await Product.deleteOne(_id);
      return !dbResponse
        ? {
            success: false,
            error: true,
            error_message: "failed to get product",
          }
        : { success: true, message: "success to get product" };
    } catch (error) {
      return {
        success: false,
        error: true,
        error_message: "failed to get product",
      };
    }
  }
}
