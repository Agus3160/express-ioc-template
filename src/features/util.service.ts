import { NextFunction, Response, Request } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { Injectable } from '../decorators/di.decorator';
import { REQUEST_ID_HEADER, AppResponse } from '../lib/types';

@Injectable()
export class UtilService {
  parseSchema<T = any>(schema: ZodSchema<T>, data: any): T {
    const result = schema.safeParse(data);
    if (!result.success) throw new ZodError(result.error.issues);
    return result.data;
  }

  getReqData(req: Request) {
    const reqId = req.headers[REQUEST_ID_HEADER];
    const reqPath = req.originalUrl;
    const reqMethod = req.method;
    return { reqId, reqPath, reqMethod };
  }

  genExceptionRes(res: Response, data: Omit<AppResponse, 'success' | 'timeStamp' | 'data'>) {
    res.status(data.status).json({ ...data, success: false, timeStamp: new Date() });
  }

  genSuccessRes<T>(res: Response, data: Omit<AppResponse<T>, 'success' | 'timeStamp'>) {
    res.status(data.status).json({ ...data, success: true, timeStamp: new Date() });
  }

  wrap(fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}
