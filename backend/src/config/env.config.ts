import { ALL } from "dns";
import getEnv from "../utils/get-env";

// Configuration for environment variables
const envConfig = () => ({
  PORT: parseInt(getEnv("PORT", "8000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),

  LOGTAIL_SOURCE_TOKEN: getEnv("LOGTAIL_SOURCE_TOKEN", "fdafa"),
  LOGTAIL_INGESTING_HOST: getEnv("LOGTAIL_INGESTING_HOST", "fadf"),

  // CORS
  ALLOWED_ORIGIN: getEnv("ALLOWED_ORIGIN", "*"),

  //Database
  MONGODB_URI: getEnv("MONGODB_URI", ""),
});

export const Env = envConfig();
