// src/utils/validators.js
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from './constants.js';

export const validateRegistration = (input) => {
  const errors = [];

  if (!input.username || input.username.length < USERNAME_MIN_LENGTH) {
    errors.push(
      `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
    );
  }

  if (!input.email || !isValidEmail(input.email)) {
    errors.push('Invalid email address');
  }

  if (!input.password || input.password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    );
  }

  return errors.length > 0 ? errors.join(', ') : null;
};

export const validateLogin = (input) => {
  const errors = [];

  if (!input.email || !isValidEmail(input.email)) {
    errors.push('Invalid email address');
  }

  if (!input.password) {
    errors.push('Password is required');
  }

  return errors.length > 0 ? errors.join(', ') : null;
};

export const validateTodoInput = (input) => {
  const errors = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required');
  }

  return errors.length > 0 ? errors.join(', ') : null;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
