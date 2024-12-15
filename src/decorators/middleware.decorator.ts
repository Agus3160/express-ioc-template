import { Constructor } from "awilix";
import { MetadataKeys } from "./metadata-keys";

export const UseMiddleware =
  (...Constructors: Constructor<any>[]) =>
  (target: any, propertyKey?: string | symbol, _descriptor?: PropertyDescriptor) => {
    const middlewareNames = Constructors.map((c) => c.name);
    if (propertyKey) {
      const middlewares: string[] =
        Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, propertyKey) || [];
      middlewares.push(...middlewareNames);
      Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewares, target, propertyKey);
    } else {
      const middlewares: string[] =
        Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target) || [];
      middlewares.push(...middlewareNames);
      Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewares, target);
    }
  };