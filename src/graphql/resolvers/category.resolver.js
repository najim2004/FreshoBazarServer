import { CategoryService } from "../../services/category.service.js";

const categoryService = new CategoryService();

export const categoryResolvers = {
  Query: {
    getAllCategories: async () => await categoryService.getAllCategories(),
  },
};
