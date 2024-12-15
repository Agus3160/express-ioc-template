import { Request } from "express";
import { Ctx } from "../lib/types";
import { User } from "../features/user/user.type";

declare global {
  namespace Express {
    export interface Request {
      ctx?: Ctx;
      user?: User;
    }
  }
}
