import { GraphQLError } from "graphql";

export const getAuthorizationHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new GraphQLError("Authorization header is required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new GraphQLError("Token not provided", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return token;
};
