// src/graphql/resolvers/index.js

import { favoriteResolvers } from "./favorite.resolver.js";
import { productResolvers } from "./product.resolver.js";
import { userResolvers } from "./user.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...favoriteResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...favoriteResolvers.Mutation,
  },
};
