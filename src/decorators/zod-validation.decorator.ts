import { MetadataKeys } from './metadata-keys';
import { ZodValidationConfig } from '../lib/types';
import { ZodValidation } from '../middleware/zod.middleware';
import { UseMiddleware } from './middleware.decorator';

export const SchemaValidation =
  (config: ZodValidationConfig): MethodDecorator =>
  (target, propertyKey) => {
    UseMiddleware(ZodValidation)(target, propertyKey);
    Reflect.defineMetadata(MetadataKeys.ZOD, config, target, propertyKey);
  };
