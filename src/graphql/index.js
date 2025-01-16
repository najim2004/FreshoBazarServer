// src/graphql/index.js
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./typeDefs/index.js";
import { resolvers } from "./resolvers/index.js";

export const createApolloGraphQLServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  return expressMiddleware(server, {
    context: ({ req }) => ({ req }),
  });
};
