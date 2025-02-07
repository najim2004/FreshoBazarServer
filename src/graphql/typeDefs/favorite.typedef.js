export const favoriteTypeDefs = `#graphql
    scalar DateTime
    enum Request{
        add
        delete
    }

    type ProductInFavorite {
        product_id: ID!
        addedAt: DateTime
    }

    type Favorite {
        _id: ID!
        user_id: ID!
        products: [ProductInFavorite]
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    type FavoritePayload {
        success: Boolean!
        product_id: ID
        request:Request
        error: Boolean
        message: String
    }

    type Query {
        getFavorites: Favorite
    }

    type Mutation {
        toggleFavorite(product_id: ID!): FavoritePayload
    }
`;
