import app from "./app";
import { Env } from "./config/env.config";
import logger from "./utils/logger";

const startServer = async () => {
  try {
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

          logger.info(`Server has shut down gracefully.`);
          process.exit(0);
        } catch (error) {
          logger.error(
            `Error occurred while shutting down the server: ${error}`
          );
          process.exit(1);
        }
      });
    });
  } catch (error) {
    logger.error(`Error occurred while starting the server: ${error}`);
    process.exit(1);
  }
};

startServer();
