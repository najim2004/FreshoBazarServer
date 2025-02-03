// src/utils/validators.js
import { AUTH } from "./constants.js";

export const validateRegistration = (input) => {
  try {
    if (!input?.password || input?.password.length < AUTH.PASSWORD_MIN_LENGTH)
      throw new Error("Password must be at least 6 characters");
    if (!input?.email || !AUTH.EMAIL_PATTERN.test(input?.email))
      throw new Error("Invalid email address");
    if (
      !input?.phoneNumber ||
      input?.phoneNumber.length !== AUTH.PHONE_LENGTH ||
      !AUTH.PHONE_PATTERN.test(input?.phoneNumber)
    )
      throw new Error("Invalid operator or phone number");
    if (!input?.firstName || input?.firstName.length < AUTH.NAME_MIN_LENGTH)
      throw new Error("First name must be at least 2 characters");
    if (input?.lastName && input?.lastName.length < AUTH.NAME_MIN_LENGTH)
      throw new Error("Last name must be at least 2 characters");
  } catch (error) {
    if (error)
      return { success: false, error: true, error_message: error.message };
  }
};

export const validateLogin = (input) => {
  try {
    if (!input?.password) throw new Error("Password is required");
    if (!input?.email || !AUTH.EMAIL_PATTERN.test(input?.email))
      throw new Error("Invalid email address");
  } catch (error) {
    if (error)
      return { success: false, error: true, error_message: error.message };
  }
};

export const validateProduct = (input) => {
  try {
    if (!isValidProduct(input))
      throw new Error("Invalid or missing required product fields");
    
    if (input.stockSize < 0)
      throw new Error("Stock size cannot be negative");
      
    if (input.price <= 0)
      throw new Error("Price must be greater than zero");
      
    if (input.discountValue < 0 || input.discountValue > 100)
      throw new Error("Discount value must be between 0 and 100");

  } catch (error) {
    return { success: false, error: true, error_message: error.message };
  }
};

export const isValidProduct = (p) => {
  return p && typeof p === "object" && 
    ["title", "description", "categoryId", "categoryName", "subCategories", 
      "unitType", "unitSize", "stockSize", "price", "currency", 
      "isDiscountable", "discountValue", "tags", "isAvailable"]
      .every(f => p[f]) && p.images?.length;
};