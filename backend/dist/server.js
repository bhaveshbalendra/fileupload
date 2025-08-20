"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const db_1 = require("./utils/db");
const logger_1 = __importDefault(require("./utils/logger"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const server = app_1.default.listen(env_config_1.Env.PORT, () => {
            logger_1.default.info(`Server is running on PORT:${env_config_1.Env.PORT}`);
        });
        const shutdownSignal = ["SIGINT", "SIGTERM"];
        shutdownSignal.forEach((signal) => {
            process.on(signal, () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    server.close(() => {
                        logger_1.default.info(`Server is shutting down due to ${signal}`);
                    });
                    yield (0, db_1.disconnectDB)();
                    logger_1.default.info(`Server has shut down gracefully.`);
                    process.exit(0);
                }
                catch (error) {
                    logger_1.default.error(`Error occurred while shutting down the server: ${error}`);
                    yield (0, db_1.disconnectDB)();
                    process.exit(1);
                }
            }));
        });
    }
    catch (error) {
        logger_1.default.error(`Error occurred while starting the server: ${error}`);
        yield (0, db_1.disconnectDB)();
        process.exit(1);
    }
});
startServer();
