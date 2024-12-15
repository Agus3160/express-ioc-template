import { createLogger } from "winston";
import { loggerOptions } from "../configuration/logger.options";

export class LoggerService {
  private static logger = createLogger(loggerOptions);

  public static info(message?: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  public static error(message?: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  public static warn(message?: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  public static debug(message?: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
