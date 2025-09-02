import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, json, urlencoded } from "express";
import helmet from "helmet";
import hpp from "hpp";
import options from "./config/cors.config";
import { Env } from "./config/env.config";
import { swaggerDocs, swaggerUi } from "./config/swagger";
import { errorHandler } from "./middlewares/error.middleware";
import { createRateLimiter } from "./middlewares/rate-limiter.middleware";
import healthCheckRoute from "./routes/healthCheck.route";
import analyticsRoute from "./routes/internal/analytics.route";
import apikeyRoute from "./routes/internal/apikey.route";
import authRoute from "./routes/internal/auth.route";
import filesRoute from "./routes/internal/files.route";

// Express application
const app: Application = express();

app.use(helmet());
app.use(hpp());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// app.set("trust proxy", 1);

//Cors Middleware config
app.use(cors(options));

// Rate limiting middleware (global)
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
// Auth routes
app.use(`${Env.BASE_PATH}/auth`, authRoute);

// Files routes
app.use(`${Env.BASE_PATH}/files`, filesRoute);

// Analytics routes
app.use(`${Env.BASE_PATH}/analytics`, analyticsRoute);

// API Key routes
app.use(`${Env.BASE_PATH}/apikey`, apikeyRoute);

// Health check route
app.use("/", healthCheckRoute);

// Error handling middleware
app.use(errorHandler);

// Export the app
export default app;