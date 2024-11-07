// src/graphql/index.js
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./typeDefs/index.js";
import { resolvers } from "./resolvers/index.js";

export const createApolloGraphQLServer = async () => {
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
      origin: "*", // or specify your frontend domain for better security
      credentials: true,
    },
  });

  await gqlServer.start();

  return expressMiddleware(gqlServer, {
    context: async ({ req }) => {
      return {
        req,
      };
    },
  });
};
