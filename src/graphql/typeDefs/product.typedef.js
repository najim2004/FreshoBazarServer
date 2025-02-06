// product gql type definition

export const productTypeDefs = `#graphql
    # Scalar Types
    scalar DateTime
    scalar Upload

    # Enum Types
    enum UnitType {
    kg
    g
    l
    ml
    piece
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

    # Location Type
    type Location {
    subDistrict: String
    district: String
    }

    # Image Type
    type Image {
    id: String
    url: String
    }

    # Product Type
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
    location: Location!
    isFavorite: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
    }

    # Pagination Type
    type Pagination {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
    }

    # Payload Types
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
    pagination: Pagination
    }

    # Input Types
    input LocationInput {
    subDistrict: String
    district: String
    }

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

    input GetProducts {
    categoryId: String
    search: String
    subcategories: [String]
    dietaryOptions: DietaryOptions
    unitSize: UnitSizeForSort
    date: DateForSort
    price: PriceForSort
    otherOptions: [String]
    priceRange: [Int]
    page: Int
    }

    # Queries
    type Query {
    getProduct(id: ID!): ProductPayload
    getProducts(input: GetProducts): ProductsPayload
    getFeaturedProducts: ProductsPayload
    }

    # Mutations
    type Mutation {
    createProduct(input: CreateProduct): ProductPayload
    deleteProduct(id: ID!): ProductDeletePayload
    }

`;
