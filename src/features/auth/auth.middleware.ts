import { Request, Response } from "express";
import { IMiddleware } from "../../core/interfaces";
import { JwtService } from "../jwt/jwt.service";
import { Exception } from "../../core/exception";
import { PrismaService } from "../prisma.service";
import { MetadataKeys } from "../../decorators/metadata-keys";
import { LoggerService } from "../logger.service";

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async use(req: Request, _res: Response, next: Function): Promise<void> {
    const token = this.jwtService.extractTokenFromHeader(req);
    if (!token) return next(new Exception("Unauthorized", 401));
    const payload = this.jwtService.verifyToken(token);
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, username: true, roles: true },
    });
    if (!user) return next(new Exception("Unauthorized", 401));
    req.user = { ...user, roles: user.roles.map((role) => role.name) };
    next();
  }
}


export class RoleMiddleware implements IMiddleware {

  async use(req: Request, _res: Response, next: Function): Promise<void> {
    const roles = this.getRolesFromMetadata(req);
    if(roles.length === 0) return next();
    const user = req.user;
    if(!user) return next(new Exception("Unauthorized", 401));
    const userRoles = user.roles;
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) return next(new Exception("Forbidden", 403));
    next();
  }

  private getRolesFromMetadata(req:Request): string[] {
    const ctx = req.ctx;
    if (!ctx) throw new Exception("Unauthorized", 401);
    const controllerRoles:string[] = Reflect.getMetadata(MetadataKeys.ROL, ctx.controller.prototype) || [];
    const methodsRoles: string[] = Reflect.getMetadata(MetadataKeys.ROL, ctx.controller.prototype, ctx.handler) || []
    if(methodsRoles.length === 0 && controllerRoles.length === 0) {
      LoggerService.warn("No roles found in metadata");
      return [];
    }
    return controllerRoles.length > 0? controllerRoles : methodsRoles
  }

}