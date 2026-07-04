import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || (isProduction ? null : 'dev-jwt-secret-change-me');

if (!jwtSecret && isProduction) {
  throw new Error('JWT_SECRET must be set when NODE_ENV=production');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "codecatalyst_lms",

  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
  USE_MYSQL: process.env.USE_MYSQL === 'true' || false,
};

