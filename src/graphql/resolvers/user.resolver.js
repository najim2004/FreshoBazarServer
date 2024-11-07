// src/graphql/resolvers/user.resolver.js
import { UserService } from "../../services/user.service.js";

const userService = new UserService();

export const userResolvers = {
  Query: {
    user: async (_, { id }) => await userService.getUser(id),
  },

  Mutation: {
    register: async (_, { input }) => await userService.register(input),
    login: async (_, { input }) => await userService.login(input),
  },
};
