export const cartTypeDefs = `#graphql
    # Cart Item Type
    type CartItem {
        product_id: ID!
        name: String!
        quantity: Int!
        thumbnail: String!
    }

    # Cart Type
    type Cart {
        _id: ID!
        user_id: ID!
        items: [CartItem!]!
        total_quantity: Int!
        status: String!
        createdAt: Date
        updatedAt: Date
    }

    # Input type for adding items to the cart
    input CartItemInput {
        product_id: ID!
        quantity: Int!
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
        getCart: CartPayload
    }

    # Mutations for adding, updating, and removing items in the cart
     type Mutation {
        addItemToCart(item: CartItemInput!): CartPayload
        updateCartItem(item: UpdateCartItemInput!): CartPayload
        removeItemFromCart(productId: ID!): CartPayload
        clearCart: CartPayload
    }

    # Scalar type for flexible JSON fields (if your GraphQL setup includes a JSON type)
    scalar JSON
    scalar Date

`;
