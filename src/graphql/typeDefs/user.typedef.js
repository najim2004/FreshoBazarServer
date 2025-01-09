export const userTypeDefs = `#graphql
  scalar DateTime
  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    phoneNumber: String!
    role: String!
    profileImage: String
    lastLogin: DateTime
    failedLoginAttempts: Int!
    accountLocked: Boolean!
    legalDocumentsInfo: LegalDocumentsInfo
    addresses: [Address]
    preferences: Preferences
    lastActive: DateTime
    referredBy: User
    rewardsPoints: Int!
    recentSearches: [String]
    browsingHistory: [BrowsingHistory]
    acceptedTerms: Boolean!
    acceptedPrivacyPolicy: Boolean!
    consentForDataProcessing: Boolean!
    isDelete: Boolean!
    deletedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type LegalDocumentsInfo {
    photo: String!
    fullName: String!
    gender: String!
    nationality: String!
    dateOfBirth: DateTime!
    NIDNumber: String
    NIDPicture: String
    passportNumber: String
    passportPicture: String
    drivingLicenseNumber: String
    drivingLicensePicture: String
    birthCertificateNumber: String
    birthCertificatePicture: String
  }

  type Address {
    label: String
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
    isDefault: Boolean!
  }

  type Preferences {
    notificationPreferences: NotificationPreferences
    marketingOptIn: Boolean!
  }

  type NotificationPreferences {
    email: Boolean!
    sms: Boolean!
    pushNotifications: Boolean!
  }

  type BrowsingHistory {
    productId: ID!
    viewedAt: DateTime!
  }

  type UserPayload {
    success: Boolean!
    user: User
    error: Boolean
    error_message: String
  }

  input RegisterInput {
    firstName: String!
    lastName: String
    email: String!
    password: String!
    phoneNumber: String!
  }

  type RegisterPayload {
    success: Boolean!
    message: String
    error: Boolean
    error_message: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginPayload {
    success: Boolean!
    message: String
    error: Boolean
    error_message: String
    token: String
  }

  type Query {
    user(id: ID): UserPayload!
  }

  type Mutation {
    register(input: RegisterInput!): RegisterPayload!
    login(input: LoginInput!): LoginPayload!
  }

`;
