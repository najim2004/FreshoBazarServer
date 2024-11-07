export const userTypeDefs = `#graphql
  scalar DateTime

  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type UserPayload {
    success: Boolean!
    user: User
    error: Boolean
    error_message: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  type RegisterPayload {
    success: Boolean!
    message: String
    error: Boolean
    error_message: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginPayload {
    success: Boolean!
    message: String
    error: Boolean
    error_message: String
  }

  type Query {
    user(id:ID): UserPayload!
  }

  type Mutation {
    register(input: RegisterInput!): RegisterPayload!
    login(input: LoginInput!): LoginPayload!
  }
`;
