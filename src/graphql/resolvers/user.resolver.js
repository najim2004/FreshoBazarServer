// src/graphql/resolvers/user.resolver.js
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { UserService } from "../../services/user.service.js";

const userService = new UserService();

export const userResolvers = {
  Query: {
    getUser: authMiddleware.protect(
      async (_, __, { user }) => await userService.getUser(user) // userService থেকে getUser কল করছি
    ),
  },

  Mutation: {
    register: async (_, { input }) => await userService.register(input),
    login: async (_, { input }) => await userService.login(input),
  },
};
