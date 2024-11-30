// product gql type definition

export const productTypeDefs = `#graphql
    scalar DateTime
    scalar Upload

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

    type Image {
        id: String
        url: String
    }

    type Product {
        _id: ID!
        isDelete: Boolean
        isAvailable: Boolean!
        title: String!
        slug: String!
        description: String
        images: [Image]!
        thumbnail: Image
        categoryId: ID!
        categoryName: String!
        subCategories: [String]
        unitType: UnitType!
        unitSize: Float!
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
        products: [Product!]
        error: Boolean
        error_message: String
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
        slug: String
        description: String
        images: [Upload]!
        thumbnail: Upload
        categoryId: ID!
        categoryName: String!
        subCategories: [String]
        unitType: UnitType!
        unitSize: Float!
        stockSize: Int!
        price: Float!
        currency: String
        isDiscountable: Boolean
        discountValue: Int
        tags: [String]!
        location: LocationInput
    }

    # Queries types
    type Query{
        getProduct(id:ID!): ProductPayload
        getProducts: ProductsPayload
    }

    # Mutations types
    type Mutation{
        createProduct(input:CreateProduct ): ProductPayload
        # updateProduct(id:ID!, input: ProductInput!): productPayload
        deleteProduct(id:ID!): ProductDeletePayload
    }
`;
