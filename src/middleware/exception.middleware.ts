import { Request, Response } from "express";
import { IGlobalExceptionHandler } from "../core/interfaces";
import { Exception } from "../core/exception";
import { errorRes } from "../lib/util";
import { LoggerService } from "../features/logger.service";

export class ErrorHandler implements IGlobalExceptionHandler {
  use(err: unknown, req: Request, res: Response, next: Function): void {
    LoggerService.error(
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
