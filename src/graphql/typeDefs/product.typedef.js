// product gql type definition

export const productTypeDefs = `#graphql
    scalar DateTime

    enum UnitType {
        kg
        g
        l
        ml
        piece
    }

    type Location {
        subDistrict: String
        district: String
    }

    type Product {
        _id: ID!
        isDelete: Boolean
        isAvailable: Boolean!
        title: String!
        slug: String!
        description: String
        images: [String]!
        thumbnail: String
        category: ID!
        subCategories: [String]
        unitType: UnitType!
        unitSize: Int!
        stockSize: Int!
        price: Float!
        currency: String
        isDiscountable: Boolean
        discountValue: Int
        averageRating: Float
        ratingsCount: Int
        tags: [String]!
        location:Location!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type ProductPayload {
        success: Boolean!
        product: Product
        error: Boolean
        error_message: String
    }

    type ProductDeletePayload {
        success: Boolean!
        error: Boolean
        error_message: String
    }

    type ProductsPayload {
        success: Boolean!
        products: [Product]
        error: Boolean
        error_message: String
    }

    # Queries types
    extend type Query{
        product(id:ID!): ProductPayload
        products: ProductsPayload
    }

    # Input types
    input LocationInput {
        subDistrict: String
        district: String
    }

    # Input types

    input CreateProduct {
        isAvailable: Boolean!
        title: String!
        slug: String!
        description: String
        images: [String]!
        thumbnail: String
        category: ID!
        subCategories: [String]
        unitType: UnitType!
        unitSize: Int!
        stockSize: Int!
        price: Float!
        currency: String
        isDiscountable: Boolean
        discountValue: Int
        tags: [String]!
        location: LocationInput
    }

    # Mutations types
    extend type Mutation{
        createProduct(input:CreateProduct ): ProductPayload
        # updateProduct(id:ID!, input: ProductInput!): productPayload
        deleteProduct(id:ID!): ProductDeletePayload
    }

    

`;
