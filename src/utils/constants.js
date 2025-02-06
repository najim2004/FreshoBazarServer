// src/utils/constants.js

// Authentication & User Related Constants
export const AUTH = {
  PASSWORD_MIN_LENGTH: 6,
  TOKEN_EXPIRY: "24h",
  SALT_ROUNDS: 10,
  PHONE_LENGTH: 11,
  PHONE_PATTERN: /^(013|014|015|016|017|018|019)\d{8}$/,
  NAME_MIN_LENGTH: 2,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

// Error Codes
export const ERROR_CODES = {
  BAD_USER_INPUT: "BAD_USER_INPUT",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  ITEM_NOT_FOUND: "ITEM_NOT_FOUND",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  CART_EMPTY: "CART_EMPTY",
  DATABASE_ERROR: "DATABASE_ERROR",
};

// Response Messages
export const MESSAGES = {
  SUCCESS: "Operation successful",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
};
