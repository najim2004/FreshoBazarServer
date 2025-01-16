import jwt from "jsonwebtoken";
// Verify access token
export const verifyToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
};
