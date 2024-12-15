import { MetadataKeys } from "./metadata-keys";
import { ZodValidationConfig } from "../lib/types";
import { ZodValidation } from "../middleware/zod.middleware";

export const SchemaValidation = (
  config: ZodValidationConfig
):MethodDecorator => (target, propertyKey) => {
  const middlewareNames = [ZodValidation.name];
  const middlewares: string[] = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, propertyKey) || [];
  middlewares.push(...middlewareNames);
  Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewares, target, propertyKey);
  Reflect.defineMetadata(MetadataKeys.ZOD, config, target, propertyKey);  
}
