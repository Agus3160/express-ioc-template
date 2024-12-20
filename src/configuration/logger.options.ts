import { format, LoggerOptions, transports } from "winston";
import { envValues } from "./env.config";

export const loggerOptions: LoggerOptions = {
  level: envValues.LOGGER_LEVEL,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({
          all: true,
          colors: {
            info: "blue",
            error: "red",
            warn: "yellow",
            debug: "green",
          },
        }),
        format.simple(),
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] ${level}: ${message}`
        )
      ),
    }),
  ],
};
