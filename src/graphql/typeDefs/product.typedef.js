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
        totalReviews: Int
        tags: [String]!
        location:Location!
        isFavorite: Boolean
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

    type Pagination {
        currentPage: Int!
        totalPages: Int!
        totalItems: Int!
        hasNextPage: Boolean!
        hasPrevPage: Boolean!
    }

    type ProductsPayload {
        success: Boolean!
        products: [Product!]
        error: Boolean
        error_message: String
        pagination: Pagination
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

    enum PriceForSort {
        highest_price
        lowest_price
    }
    enum DietaryOptions {
        none_organic
        organic
    }
    enum UnitSizeForSort {
        bigger_first
        smallest_first
    }
    enum DateForSort {
        oldest
        newest
    }

    

    input GetProducts {
        categoryId: String,
        search: String,
        subcategories: [String],
        dietaryOptions: DietaryOptions,
        unitSize: UnitSizeForSort,
        date: DateForSort,
        price: PriceForSort,
        otherOptions: [String],
        priceRange: [Int],
        page: Int,
    }

    # Queries types
    type Query{
        getProduct(id:ID!): ProductPayload
        getProducts(input:GetProducts): ProductsPayload
        getFeaturedProducts: ProductsPayload
    }

    # Mutations types
    type Mutation{
        createProduct(input:CreateProduct ): ProductPayload
        # updateProduct(id:ID!, input: ProductInput!): productPayload
        deleteProduct(id:ID!): ProductDeletePayload
    }
`;
