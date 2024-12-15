import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export type Constructor<T = any> = new (...args: any[]) => T;

export type HTTPMethods = "get" | "post" | "put" | "delete";

export type RouteConfig = {
  path: string;
  method: HTTPMethods;
  symbol: symbol | string;
};

export type DIParams = {
  index: number;
  target: Constructor<any>;
};

export type FeatureModule = {
  controllers: Constructor<any>[];
  services: Constructor<any>[];
};

export type ApplicationRegisterDepenedncies = {
  providers?: Constructor<any>[];
  middlewares?: Constructor<any>[];
  modules: Constructor<any>[];
};

export type Ctx = {
  controller: Constructor<any>;
  handler: symbol | string;
};

export type ZodValidationConfig = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export type MiddlewareType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
export type UseHandlerType = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type AppResponse<T = undefined> = {
  status: number;
  success: boolean;
  message: string;
  timeStamp: Date;
  data?: T;
  errors?: string[];
};

export type BaseModel = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
