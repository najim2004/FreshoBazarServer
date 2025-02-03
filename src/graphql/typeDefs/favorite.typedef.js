export const favoriteTypeDefs = `#graphql
    scalar DateTime

    type ProductInFavorite {
        productId: ID!
        addedAt: DateTime
    }

    type Favorite {
        _id: ID!
        userId: ID!
        products: [ProductInFavorite]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type FavoritePayload {
        success: Boolean!
        favorites: Favorite
        error: Boolean
        error_message: String
    }

    type Query {
        getFavorites: FavoritePayload
    }

    type Mutation {
        toggleFavorite(productId: ID!): FavoritePayload
    }
`;
