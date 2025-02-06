export const cartTypeDefs = `#graphql
    # Scalar Types
    scalar JSON
    scalar Date

    # Cart Item Type
    type CartItem {
    product_id: ID!
    name: String!
    quantity: Int!
    price: Float!
    discount_value: Int!
    thumbnail: String!
    }

    # Cart Type
    type Cart {
    _id: ID!
    user_id: ID!
    items: [CartItem!]!
    total_quantity: Int!
    total_price: Float!
    status: String!
    createdAt: Date
    updatedAt: Date
    }

    # Cart Item Input Type for adding items to the cart
    input CartItemInput {
    product_id: ID!
    quantity: Int!
    }

    # Input Type for updating item quantities in the cart
    input UpdateCartItemInput {
    product_id: ID!
    quantity: Int!
    }

    # Cart Payload Type for mutation responses
    type CartPayload {
    success: Boolean!
    message: String!
    cart: Cart
    error: ErrorDetails
    }

    # Error Details Type
    type ErrorDetails {
    code: String
    details: JSON
    }

    # Query for fetching a user's cart
    type Query {
    getCart: CartPayload
    }

    # Mutations for managing the cart
    type Mutation {
    addItemToCart(item: CartItemInput!): CartPayload
    updateCartItem(item: UpdateCartItemInput!): CartPayload
    removeItemFromCart(product_id: ID!): CartPayload
    clearCart: CartPayload
    }
`;
