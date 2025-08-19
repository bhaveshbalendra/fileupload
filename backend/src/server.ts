import app from "./app";
import { Env } from "./config/env.config";
import { connectDB, disconnectDB } from "./utils/db";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(Env.PORT, () => {
      logger.info(`Server is running on PORT:${Env.PORT}`);
    });
    const shutdownSignal = ["SIGINT", "SIGTERM"];

    shutdownSignal.forEach((signal) => {
      process.on(signal, async () => {
        try {
          server.close(() => {
            logger.info(`Server is shutting down due to ${signal}`);
          });

          await disconnectDB();

          logger.info(`Server has shut down gracefully.`);
          process.exit(0);
        } catch (error) {
          logger.error(
            `Error occurred while shutting down the server: ${error}`
          );
          await disconnectDB();
          process.exit(1);
        }
      });
    });
  } catch (error) {
    logger.error(`Error occurred while starting the server: ${error}`);
    await disconnectDB();
    process.exit(1);
  }
};

startServer();
