import { Request, Response } from "express";

export interface IMiddleware {
  use(req: Request, res: Response, next: Function): void | Promise<void>;
}

export interface IGlobalExceptionHandler {
  use(err:unknown, req: Request, res: Response, next: Function): void | Promise<void>;
}