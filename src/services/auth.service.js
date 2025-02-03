// src/services/auth.service.js
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import { User } from "../models/user.model.js";
import { AuthenticationError } from "../utils/errors.js";

export class AuthService {
  generateToken(user) {
    return jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) throw new AuthenticationError("User not found");
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid token");
    }
  }
}
