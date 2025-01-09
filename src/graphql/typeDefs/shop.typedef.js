export const shopTypeDefs = `#graphql
    """
    Represents a physical location with address details
    """
    type Location {
        address: String!
        city: String!
        state: String
        country: String!
        postalCode: String
        coordinates: Coordinates
    }

    """
    Geographic coordinates
    """
    type Coordinates {
        lat: Float!
        lng: Float!
    }

    """
    Contact information
    """
    type Contact {
        phone: String!
        email: String!
        website: String
        socialMedia: SocialMedia
    }

    """
    Social media links
    """
    type SocialMedia {
        facebook: String
        instagram: String
        twitter: String
    }

    """
    Rating statistics
    """
    type Ratings {
        average: Float!
        count: Int!
        reviews: [Review]
    }

    """
    Customer review
    """
    type Review {
        rating: Int!
        comment: String
        createdAt: String!
        userId: ID!
    }

    """
    Shop entity representing a business
    """
    type Shop {
        id: ID!
        name: String!
        owner: ID!
        description: String
        location: Location!
        contact: Contact!
        status: ShopStatus!
        ratings: Ratings
        totalSales: Float!
        totalEarnings: Float!
        businessHours: BusinessHours
        categories: [String!]
        tags: [String!]
        createdAt: String!
        updatedAt: String!
    }

    """
    Business operating hours
    """
    type BusinessHours {
        monday: String
        tuesday: String
        wednesday: String
        thursday: String
        friday: String
        saturday: String
        sunday: String
    }

    """
    Shop status enum
    """
    enum ShopStatus {
        ACTIVE
        INACTIVE
        PENDING
        SUSPENDED
    }

    input LocationInput {
        address: String!
        city: String!
        state: String
        country: String!
        postalCode: String
        coordinates: CoordinatesInput
    }

    input CoordinatesInput {
        lat: Float!
        lng: Float!
    }

    input ContactInput {
        phone: String!
        email: String!
        website: String
        socialMedia: SocialMediaInput
    }

    input SocialMediaInput {
        facebook: String
        instagram: String
        twitter: String
    }

    input BusinessHoursInput {
        monday: String
        tuesday: String
        wednesday: String
        thursday: String
        friday: String
        saturday: String
        sunday: String
    }

    input CreateShopInput {
        name: String!
        description: String
        location: LocationInput!
        contact: ContactInput!
        categories: [String!]
        tags: [String!]
        businessHours: BusinessHoursInput
    }

    input UpdateShopInput {
        name: String
        description: String
        location: LocationInput
        contact: ContactInput
        status: ShopStatus
        categories: [String!]
        tags: [String!]
        businessHours: BusinessHoursInput
    }

    type Query {
        """
        Retrieve all shops
        """
        shops(
            limit: Int
            offset: Int
            status: ShopStatus
        ): [Shop!]!

        """
        Get a specific shop by ID
        """
        shop(id: ID!): Shop

        """
        Get shops by owner ID
        """
        shopsByOwner(ownerId: ID!): [Shop!]!
    }

    type Mutation {
        """
        Create a new shop
        """
        createShop(input: CreateShopInput!): Shop!

        """
        Update an existing shop
        """
        updateShop(id: ID!, input: UpdateShopInput!): Shop!

        """
        Delete a shop
        """
        deleteShop(id: ID!): Boolean!
    }
`;
