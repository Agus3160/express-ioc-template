import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { successRes } from "../../lib/util";
import { Controller } from "../../decorators/controller.decorator";
import { Get, Post } from "../../decorators/method.decorato";
import { SchemaValidation } from "../../decorators/zod-validation.decorator";
import { SignInSchema, SignUpSchema } from "./auth.types";
import { UseMiddleware } from "../../decorators/middleware.decorator";
import { AuthMiddleware } from "./auth.middleware";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @SchemaValidation({body:SignUpSchema})
  async signup(req: Request, res: Response, _next: NextFunction) {
    await this.authService.signup(req.body);
    successRes(res, { data: null, status: 201, message: "Signup Success" });
  }

  @Post("/signin")
  @SchemaValidation({body:SignInSchema})
  async signin(req: Request, res: Response, _next: NextFunction) {
    const token = await this.authService.signin(req.body);
    successRes(res, { data: { token }, status: 200, message: "Login Success" });
  }

  @Get("/me")
  @UseMiddleware(AuthMiddleware)
  async me(req: Request, res: Response, _next: NextFunction) {
    successRes(res, { data: req.user!, status: 200, message: "Me Success" });
  }

}
