import { IMiddleware } from '../core/interfaces';
import { Constructor } from '../lib/types';
import { MetadataKeys } from './metadata-keys';

export const HandlerDecoratorFactory =
  (type: MetadataKeys.INTERCEPTOR | MetadataKeys.MIDDLEWARE) =>
  (...handlers: Constructor<IMiddleware>[]) =>
  (target: any, pk?: string | symbol) => {
    if (pk) {
      const current = Reflect.getMetadata(type, target, pk) || [];
      current.push(...handlers);
      Reflect.defineMetadata(type, current, target, pk);
    } else {
      const middlewares = Reflect.getMetadata(type, target) || [];
      middlewares.push(...handlers);
      Reflect.defineMetadata(type, middlewares, target);
    }
  };

export const UseMiddleware = HandlerDecoratorFactory(MetadataKeys.MIDDLEWARE);
export const UseInterceptor = HandlerDecoratorFactory(MetadataKeys.INTERCEPTOR);
