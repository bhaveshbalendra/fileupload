import app from "./app";
import { Env } from "./config/env.config";
import { connectDB, disconnectDB } from "./utils/db";
import logger from "./utils/logger";

// Start the server function
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Start the server
    const server = app.listen(Env.PORT, () => {
      logger.info(`Server is running on PORT:${Env.PORT}`);
    });

    // Graceful shutdown
    const shutdownSignal = ["SIGINT", "SIGTERM"];

    // Handle shutdown signals
    shutdownSignal.forEach((signal) => {
      process.on(signal, async () => {
        try {
          // Stop the server
          server.close(() => {
            logger.info(`Server is shutting down due to ${signal}`);
          });

          // Disconnect from the database
          await disconnectDB();

          // Log the shutdown
          logger.info(`Server has shut down gracefully.`);

          // Exit the process
          process.exit(0);
        } catch (error) {
          // Catch any errors during shutdown
          logger.error(
            `Error occurred while shutting down the server: ${error}`
          );
          await disconnectDB();
          process.exit(1);
        }
      });
    });
  } catch (error) {
    // Catch any errors during startup
    logger.error(`Error occurred while starting the server: ${error}`);
    await disconnectDB();
    process.exit(1);
  }
};

// Start the server function
startServer();
