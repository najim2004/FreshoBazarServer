import { cartTypeDefs } from "./cart.typedef.js";
import { categoryTypeDefs } from "./category.typedef.js";
import { favoriteTypeDefs } from "./favorite.typedef.js";
import { productTypeDefs } from "./product.typedef.js";
import { userTypeDefs } from "./user.typedef.js";

export const typeDefs = [
  userTypeDefs,
  productTypeDefs,
  favoriteTypeDefs,
  categoryTypeDefs,
  cartTypeDefs,
];
