import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Application } from "express";
import { Env } from "./config/env.config";
import { errorHandler } from "./middlewares/error.middleware";
import healthCheckRoute from "./routes/healthCheck.route";
import { swaggerDocs, swaggerUi } from "./swagger";
// Express application
const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use("/", healthCheckRoute);
app.use(errorHandler);

export default app;
