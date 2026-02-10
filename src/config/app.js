import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 1234;
export const APP_DOMAIN = process.env.APP_DOMAIN || "http://localhost:1234";
export const nodeEnv = process.env.NODE_ENV || "development";

export const cookies = {
  maxAge: process.env.COOKIE_MAX_AGE || 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  path: "/",
  SameSite: "Lax",
};
