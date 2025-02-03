// src/utils/errors.js
import { ERROR_CODES } from "./constants.js";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.extensions = { code: ERROR_CODES.BAD_USER_INPUT }; // Extensions for GraphQL
  }
}

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.extensions = { code: ERROR_CODES.UNAUTHENTICATED };
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.extensions = { code: ERROR_CODES.FORBIDDEN };
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.extensions = { code: ERROR_CODES.NOT_FOUND };
  }
}

// Format error function for custom error formatting
export const formatError = (error) => {
  const formattedError = {
    message: error.message,
    code: error.extensions?.code || ERROR_CODES.INTERNAL_SERVER_ERROR, // Use code from extensions
  };

  if (process.env.NODE_ENV !== "production") {
    formattedError.stack = error.stack;
  }

  return formattedError;
};
