import { LogtailTransport } from "@logtail/winston";
import winston from "winston";
import { Env } from "../config/env.config";
import { createLogtail } from "../config/longtail.config";

const { combine, colorize, timestamp, errors, json, printf } = winston.format;

// Configure transports based on environment
const transports: winston.transport[] = [];

if (Env.NODE_ENV === "production") {
  const logtail = createLogtail();
  if (logtail) {
    transports.push(new LogtailTransport(logtail));
  }
}

//
if (Env.NODE_ENV === "development") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
        errors({ stack: true }),

        printf(({ level, message, stack, timestamp, ...meta }) => {
          return `${timestamp} ${level}: ${message} ${stack ? stack : ""} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        }),
        colorize({
          all: true,
          colors: {
            info: "blue",
            warn: "yellow",
            error: "red",
            debug: "cyan",
            verbose: "grey",
            http: "green",
          },
        })
      ),
    })
  );
}

const logger = winston.createLogger({
  level: Env.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: transports,
  silent: Env.NODE_ENV === "test",
});

export default logger;
