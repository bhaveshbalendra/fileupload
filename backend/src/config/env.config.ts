import getEnv from "../utils/get-env";

// Configuration for environment variables
const envConfig = () => ({
  PORT: parseInt(getEnv("PORT", "8000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),

  BASE_PATH: getEnv("BASE_PATH", "/api"),

  LOGTAIL_SOURCE_TOKEN: getEnv("LOGTAIL_SOURCE_TOKEN", ""),
  LOGTAIL_INGESTING_HOST: getEnv("LOGTAIL_INGESTING_HOST", ""),

  // CORS
  ALLOWED_ORIGIN: getEnv("ALLOWED_ORIGIN", "*"),

  // Database
  MONGODB_URI: getEnv("MONGODB_URI", ""),

  // JWT
  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1d"),

  AWS_ACCESS_KEY: getEnv("AWS_ACCESS_KEY", ""),
  AWS_SECRET_KEY: getEnv("AWS_SECRET_KEY", ""),
  AWS_REGION: getEnv("AWS_REGION", "us-east-1"),
  AWS_S3_BUCKET: getEnv("AWS_S3_BUCKET", ""),
});

export const Env = envConfig();
