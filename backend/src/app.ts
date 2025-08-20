import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import { Env } from "./config/env.config";
import { errorHandler } from "./middlewares/error.middleware";
import authRoute from "./routes/auth.route";
import healthCheckRoute from "./routes/healthCheck.route";
import { swaggerDocs, swaggerUi } from "./swagger";
// Express application
const app: Application = express();

app.use(helmet());
app.use(hpp());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("trust proxy", 1);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

//Cors Middleware config
app.use(
  cors({
    origin:
      Env.NODE_ENV === "production" ? Env.ALLOWED_ORIGIN : Env.ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/auth", authLimiter, authRoute);
app.use("/", healthCheckRoute);
app.use(errorHandler);

export default app;
