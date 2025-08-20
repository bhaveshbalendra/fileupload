import getEnv from "../utils/get-env";

// Configuration for environment variables
const envConfig = () => ({
  PORT: parseInt(getEnv("PORT", "8000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),

  LOGTAIL_SOURCE_TOKEN: getEnv("LOGTAIL_SOURCE_TOKEN", ""),
  LOGTAIL_INGESTING_HOST: getEnv("LOGTAIL_INGESTING_HOST", ""),

  // CORS
  ALLOWED_ORIGIN: getEnv("ALLOWED_ORIGIN", "*"),

  // Database
  MONGODB_URI: getEnv("MONGODB_URI", ""),

  // JWT
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET", ""),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", ""),
  JWT_ISSUER: getEnv("JWT_ISSUER", "fileupload"),
  JWT_AUDIENCE: getEnv("JWT_AUDIENCE", "fileupload.api"),
  ACCESS_TOKEN_TTL: getEnv("ACCESS_TOKEN_TTL", "15m"),
  REFRESH_TOKEN_TTL: getEnv("REFRESH_TOKEN_TTL", "7d"),
});

export const Env = envConfig();
