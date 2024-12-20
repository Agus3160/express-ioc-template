import { Request, Response } from "express";
import { IGlobalExceptionHandler } from "../core/interfaces";
import { Exception } from "../core/exception";
import { errorRes } from "../lib/util";
import { LoggerService } from "../features/logger.service";
import { Inject, Injectable } from "../decorators/di.decorator";

@Injectable()
export class ExceptionHandler implements IGlobalExceptionHandler {

  constructor(
    @Inject(LoggerService) private readonly logger:LoggerService
  ){}

  use(err: unknown, req: Request, res: Response, next: Function): void {
    this.logger.error(
      `[REQUEST-ID: ${req.headers["x-request-id"]}] ${req.method} ${req.url}: ${err}`
    );

    if (err instanceof Exception) {
      errorRes(res, err);
      return next();
    }

    if (err instanceof Error) {
      errorRes(res, { status: 500, message: err.message, errors: [] });
    }
  }
}
