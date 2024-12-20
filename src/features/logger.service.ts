import { createLogger } from 'winston';
import { loggerOptions } from '../configuration/logger.options';
import { Injectable } from '../decorators/di.decorator';

@Injectable()
export class LoggerService {
  private logger = createLogger(loggerOptions);

  public info(message?: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
