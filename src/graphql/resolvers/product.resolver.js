import { ProductService } from "../../services/product.service.js";

const productService = new ProductService();

export const productResolvers = {
  Query: {
    products: async () => await productService.getAllProducts(),
    product: async (_, { _id }) => await productService.getProductById(_id),
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
