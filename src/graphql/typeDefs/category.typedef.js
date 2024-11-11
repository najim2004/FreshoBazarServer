export const categoryTypeDefs = `#graphql
  type Subcategory {
    _id: ID
    name: String!
    slug: String!
  }

  type Category {
    _id: ID!
    name: String!
    slug: String!
    subcategories: [Subcategory!]!
  }
  type CategoryPayload {
    success: Boolean
    categories: [Category!]
    message: String!
  }

# query definition
  type Query {
    getAllCategories: CategoryPayload!
    # category(id: ID!): Category
  }

#   input SubcategoryInput {
#     name: String!
#     slug: String!
#   }

#   input CategoryInput {
#     name: String!
#     slug: String!
#     subcategories: [SubcategoryInput!]!
#   }

# mutation definition
#   type Mutation {
#     addCategory(input: CategoryInput!): Category!
#     updateCategory(id: ID!, input: CategoryInput!): Category!
#     deleteCategory(id: ID!): Boolean
#   }
`;
