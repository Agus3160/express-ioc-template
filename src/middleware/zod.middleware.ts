import { Request, Response } from "express";
import { IMiddleware } from "../core/interfaces";
import { MetadataKeys } from "../decorators/metadata-keys";
import { ZodValidationConfig } from "../lib/types";
import { ZodError } from "zod";
import { Exception } from "../core/exception";

export class ZodValidation implements IMiddleware {
  use(req: Request, _res: Response, next: Function): void | Promise<void> {
    try {
      const schemas = this.getSchema(req);

      if (!schemas) return next();

      if (schemas.body) {
        const result = schemas.body.parse(req.body);
        req.body = result;
      }

      if (schemas.params) {
        const result = schemas.params.parse(req.params);
        req.params = result;
      }

      if (schemas.query) {
        const result = schemas.query.parse(req.query);
        req.query = result;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map(
          (issue) => issue.path + ": " + issue.message
        );
        return next(new Exception("Bad Request", 400, errors));
      }
      next(err);
    }
  }

  private getSchema(req: Request): ZodValidationConfig | undefined {
    const ctx = req.ctx;
    if (!ctx) return undefined;
    const schema: ZodValidationConfig | undefined = Reflect.getMetadata(
      MetadataKeys.ZOD,
      ctx.controller.prototype,
      ctx.handler
    );
    return schema;
  }
}
