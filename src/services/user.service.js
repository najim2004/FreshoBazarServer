// src/services/user.service.js
import { config } from "../config/env.config.js";
import { User } from "../models/user.model.js";
import { validateLogin, validateRegistration } from "../utils/validators.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserService {
  // constructor() {
  //   this.authService = new AuthService();
  // }

  async register(input) {
    const validationErrors = validateRegistration(input);
    if (validationErrors) return validationErrors;

    try {
      const existingUser = await User.findOne({
        $or: [{ email: input?.email }, { phoneNumber: input?.phoneNumber }],
      });

      if (existingUser) throw new Error("Phon number or email already exists");

      const res = await User.create(input);
      if (!res)
        throw new Error("Failed to create registration, please try again");
      return { success: true, message: "success to create registration" };
    } catch (error) {
      return {
        success: false,
        error: true,
        error_message: error.message || "Failed to create registration",
      };
    }
  }

  async login(input) {
    const validationErrors = validateLogin(input);
    if (validationErrors) return validationErrors;
    try {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new Error("Invalid credentials");

      const isValid = await bcrypt.compare(input.password, user?.password);
      if (!isValid) throw new Error("Invalid credentials");

      const token = jwt.sign(
        {
          data: {
            _id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
          },
        },
        config.jwtSecret,
        { expiresIn: "1d" }
      );
      if (!token) throw new Error("Something went wrong, please try again");
      return { success: true, message: "Login successful", token };
    } catch (error) {
      return {
        success: false,
        error: true,
        error_message: error.message || "Failed to login",
      };
    }
  }

  async getUser(id) {
    // return await User.find({}).select("-password");
    const user = await User.findOne({ _id: id });
    if (user) return { success: true, user };
    return { success: false, error: true, error_message: "User not found" };
  }

  // async getUserById(id) {
  //   return await User.findById(id).select("-password");
  // }
}
