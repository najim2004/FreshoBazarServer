// src/graphql/resolvers/index.js

import { cartResolvers } from "./cart.resolver.js";
import { categoryResolvers } from "./category.resolver.js";
import { favoriteResolvers } from "./favorite.resolver.js";
import { productResolvers } from "./product.resolver.js";
import { userResolvers } from "./user.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...favoriteResolvers.Query,
    ...categoryResolvers.Query,
    ...cartResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...favoriteResolvers.Mutation,
    ...cartResolvers.Mutation,
  },
};
