// src/services/user.service.js
import { User } from "../models/user.model.js";

export class UserService {
  // constructor() {
  //   this.authService = new AuthService();
  // }

  async register(input) {
    // const validationErrors = validateRegistration(input);
    // if (validationErrors) throw new ValidationError(validationErrors);

    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      // throw new ValidationError("Username or email already exists");
      return {
        success: false,
        error: true,
        error_message: "user already exist",
      };
    }

    // const user = await User.create(input);
    // const token = this.authService.generateToken(user);

    // return { token, user };

    const res = await User.create(input);
    if (!res)
      return { success: false, error: true, error_message: "failed to create" };

    return { success: true, message: "success to create registration" };
  }

  async login(input) {
    // const validationErrors = validateLogin(input);
    // if (validationErrors) throw new ValidationError(validationErrors);

    // const user = await User.findOne({ email: input.email });
    // if (!user) throw new AuthenticationError("Invalid credentials");

    // const isValid = await user.comparePassword(input.password);
    // if (!isValid) throw new AuthenticationError("Invalid credentials");

    // const token = this.authService.generateToken(user);
    // return { token, user };
    return input;
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
