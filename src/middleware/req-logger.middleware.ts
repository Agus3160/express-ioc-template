import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../features/logger.service';
import { IMiddleware } from '../core/interfaces';
import { Inject, Injectable } from '../decorators/di.decorator';

@Injectable()
export class ReqLoggerMiddleware implements IMiddleware {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}
  use(req: Request, _res: Response, next: NextFunction): void {
    this.logger.debug(`[REQUEST-ID: ${req.headers['x-request-id']}] ${req.method} ${req.url}`);
    next();
  }
}
