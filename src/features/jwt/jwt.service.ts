import { Request } from "express";
import { EnvService } from "../env.service";
import { JwtPayload, Payload } from "./jwt.types";
import jwt from "jsonwebtoken";
import { Inject, Injectable } from "../../decorators/di.decorator";

@Injectable()
export class JwtService {

  constructor(
    @Inject(EnvService) private readonly env:EnvService,
  ){}

  genToken(payload:Payload) {
    const expiresIn = this.env.get("JWT_EXPIRATION_TIME");
    const secret = this.env.get("JWT_SECRET");
    return jwt.sign(payload, secret, { expiresIn });
  } 

  verifyToken(token:string) {
    const secret = this.env.get("JWT_SECRET");
    return jwt.verify(token, secret) as JwtPayload;
  }

  extractTokenFromHeader(req:Request) {
    const token = req.headers.authorization?.split(" ")[1];
    return token;
  }

}