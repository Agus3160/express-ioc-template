import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../core/interfaces';
import { REQUEST_ID_HEADER } from '../lib/types';
import crypto from 'crypto';

export class ReqIdMiddleware implements IMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.headers[REQUEST_ID_HEADER] = this.genUUID();
    next();
  }

  private genUUID(): string {
    return crypto.randomUUID();
  }
}
