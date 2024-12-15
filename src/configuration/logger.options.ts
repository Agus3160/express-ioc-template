import { format, LoggerOptions, transports } from "winston";
import { EnvService } from "../features/env.service";

export const loggerOptions: LoggerOptions = {
  level: EnvService.get("LOGGER_LEVEL"),
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
