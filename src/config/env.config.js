import dotenv from "dotenv";
dotenv.config();
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/krishok_bolchi_db",
  jwtSecret: process.env.JWT_SECRET || "super-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "30d",
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"),
};