import { Request } from "express";
import { EnvService } from "../env.service";
import { JwtPayload, Payload } from "./jwt.types";
import jwt from "jsonwebtoken";

export class JwtService {

  genToken(payload:Payload) {
    const expiresIn = EnvService.get("JWT_EXPIRATION_TIME");
    const secret = EnvService.get("JWT_SECRET");
    return jwt.sign(payload, secret, { expiresIn });
  } 

  verifyToken(token:string) {
    const secret = EnvService.get("JWT_SECRET");
    return jwt.verify(token, secret) as JwtPayload;
  }

  extractTokenFromHeader(req:Request) {
    const token = req.headers.authorization?.split(" ")[1];
    return token;
  }

}