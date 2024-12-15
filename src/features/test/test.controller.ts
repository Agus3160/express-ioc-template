import { NextFunction, Request, Response } from "express";
import { UseMiddleware } from "../../decorators/middleware.decorator";
import { AuthMiddleware } from "../auth/auth.middleware";
import { Controller } from "../../decorators/controller.decorator";
import { Get } from "../../decorators/method.decorato";
import { successRes } from "../../lib/util";

@Controller("/test")
export class TestController {

  @UseMiddleware(AuthMiddleware)
  @Get("/")
  protected(req:Request, res:Response, _next:NextFunction) {
    successRes(res, { data: req.user, status: 200, message: "Success" });
  }

}