// rateLimitMiddleware.ts
import rateLimit from "express-rate-limit";
import type { IRateLimiter } from "../types/middleware.types";
import { TooManyRequestsError } from "../utils/app-error";

/**
 * Creates a rate limiter middleware that passes errors to the global error handler.
 * @important by default the express rate limiter throw error by its middleware directly no need to handle that
 * can add in routes also like login and signup
 * @param options Configuration options for rate limiting.
 * @returns Express middleware for rate limiting.
 */
export function createRateLimiter(options: IRateLimiter) {
  return rateLimit({
    windowMs: options.windowMs || 60 * 1000, // 1 minute default
    max: options.max || 100, // Default 100 requests per window
    handler: (req, res, next) => {
      // Pass a custom 429 error to your error middleware
      next(
        new TooManyRequestsError(
          options.message || "Too many requests, please try again later."
        )
      );
    },
    // Optionally, you can disable the default message
    // message: undefined,
  });
}
