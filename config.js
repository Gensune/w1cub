import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

function getEnv(name, defaultValue) {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  env: getEnv("NODE_ENV", "development"),
  port: parseInt(getEnv("PORT", "3000"), 10),
  mongoUri: getEnv("MONGODB_URI"),
};
