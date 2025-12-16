import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

// to validate env variables
const getENV = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const ENV = {
  connection_str: getENV("CONNECTION_STRING"),
  port: getENV("PORT"),      
  jwtSecret: getENV("JWT_SECRET"),
};