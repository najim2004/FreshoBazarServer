import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { ProductService } from "../../services/product.service.js";

const productService = new ProductService();

export const productResolvers = {
  Query: {
    getProducts: authMiddleware.optionalAuth(
      async (_, { input }, { user }) =>
        await productService.getAllProducts(input, user)
    ),
    getProduct: async (_, { id }) => await productService.getProductById(id),
    getFeaturedProducts: async () => await productService.getFeaturedProducts(),
  },

  Mutation: {
    createProduct: async (_, { input }) =>
      await productService.createProduct(input),
    // updateProduct: async (_, { id, updatedProduct }) =>
    //   productService.updateProduct(id, updatedProduct),
    deleteProduct: async (_, { _id }) =>
      await productService.deleteProduct(_id),
  },
};
