export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "selene-jwt-secret-key-2026",
  expiresIn: "7d",
};
