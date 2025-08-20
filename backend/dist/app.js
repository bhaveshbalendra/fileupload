"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const env_config_1 = require("./config/env.config");
const error_middleware_1 = require("./middlewares/error.middleware");
const healthCheck_route_1 = __importDefault(require("./routes/healthCheck.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
app.use(body_parser_1.default.json({ limit: "1mb" }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use((0, cors_1.default)({
    origin: env_config_1.Env.NODE_ENV === "production" ? env_config_1.Env.ALLOWED_ORIGIN : env_config_1.Env.ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Authorization"],
}));
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs));
app.use("/auth", authLimiter, auth_route_1.default);
app.use("/", healthCheck_route_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
