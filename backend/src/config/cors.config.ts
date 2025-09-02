import { CorsOptions } from "cors";
import { Env } from "./env.config";

/**
 * CORS configuration for the application
 * Supports both single origin and multiple origins separated by commas
 * When credentials are used, wildcard (*) is not allowed
 */
const getAllowedOrigins = (): string | string[] => {
  const origin = Env.ALLOWED_ORIGIN;

  // If it's a wildcard and we're in development, default to localhost
  if (origin === "*" && Env.NODE_ENV === "development") {
    return "http://localhost:5173";
  }

  // If it contains commas, split into array
  if (origin.includes(",")) {
    return origin.split(",").map((o: string) => o.trim());
  }

  return origin;
};

// CORS options
const options: CorsOptions = {
  origin: getAllowedOrigins(),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};

export default options;