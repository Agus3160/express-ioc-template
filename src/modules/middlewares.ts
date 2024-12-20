import { AuthMiddleware } from '../features/auth/auth.middleware';
import { ReqIdMiddleware } from '../middleware/req-id.middleware';
import { ReqLoggerMiddleware } from '../middleware/req-logger.middleware';
import { ZodValidation } from '../middleware/zod.middleware';

export const MiddlewareModule = [
  AuthMiddleware,
  ReqIdMiddleware,
  ReqLoggerMiddleware,
  ZodValidation,
];
