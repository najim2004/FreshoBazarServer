export const cartTypeDefs = `#graphql
    # Cart Item Type
    type CartItem {
        productId: ID!
        name: String!
        quantity: Int!
        price: Float!
        totalPrice: Float!
        thumbnail: String
        options: JSON # JSON scalar type to handle flexible key-value options
    }

    # Cart Type
    type Cart {
        _id: ID!
        userId: ID!
        items: [CartItem!]!
        totalQuantity: Int!
        totalPrice: Float!
        status: String!
        createdAt: Date
        updatedAt: Date
    }

    # Input type for adding items to the cart
    input CartItemInput {
        productId: ID!
        quantity: Int!
        options: JSON
    }

    # Input type for updating item quantities in the cart
    input UpdateCartItemInput {
        productId: ID!
        quantity: Int!
    }

    type CartPayload {
        success: Boolean!
        message: String!
        cart: Cart
    }

    # Query for getting a user’s cart
     type Query {
        getCart(userId: ID!): CartPayload
    }

    # Mutations for adding, updating, and removing items in the cart
     type Mutation {
        addItemToCart(userId: ID!, item: CartItemInput!): CartPayload
        updateCartItem(userId: ID!, item: UpdateCartItemInput!): CartPayload
        removeItemFromCart(userId: ID!, productId: ID!): CartPayload
        clearCart(userId: ID!): CartPayload
    }

    # Scalar type for flexible JSON fields (if your GraphQL setup includes a JSON type)
    scalar JSON
    scalar Date

`;
