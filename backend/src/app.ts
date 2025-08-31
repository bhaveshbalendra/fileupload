import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import hpp from "hpp";
import options from "./config/cors.config";
import { Env } from "./config/env.config";
import { errorHandler } from "./middlewares/error.middleware";
import healthCheckRoute from "./routes/healthCheck.route";
import authRoute from "./routes/internal/auth.route";
import filesRoute from "./routes/internal/files.route";
import { swaggerDocs, swaggerUi } from "./config/swagger";

// Express application
const app: Application = express();

app.use(helmet());
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.set("trust proxy", 1);

//Cors Middleware config
app.use(cors(options));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
// Auth routes
app.use(`${Env.BASE_PATH}/auth`, authRoute);

// Files routes
app.use(`${Env.BASE_PATH}/files`, filesRoute);

// Health check route
app.use("/", healthCheckRoute);

// Error handling middleware
app.use(errorHandler);

// Rate limiting middleware
// app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Export the app
export default app;
