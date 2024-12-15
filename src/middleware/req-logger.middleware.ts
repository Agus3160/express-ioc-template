import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../features/logger.service";
import { IMiddleware } from "../core/interfaces";

export class ReqLoggerMiddleware implements IMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    LoggerService.debug(
      `[REQUEST-ID: ${req.headers["x-request-id"]}] ${req.method} ${req.url}`
    );
    next();
  }
}
