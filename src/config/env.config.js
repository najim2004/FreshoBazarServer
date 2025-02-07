import dotenv from "dotenv";
dotenv.config();
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "super-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "24h",
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};
