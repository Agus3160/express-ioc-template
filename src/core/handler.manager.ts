import { Handler } from 'express';
import { UtilService } from '../features/util.service';
import { Inject, Injectable } from '../decorators/di.decorator';
import { Constructor, GetMiddlewareParams } from '../lib/types';
import { Container } from './container';
import { IMiddleware } from './interfaces';
import { MetadataKeys } from '../decorators/metadata-keys';

@Injectable()
export class HandlerManager {
  constructor(
    @Inject(UtilService)
    private readonly util: UtilService
  ) {}

  public resolveAllHandlers(data: GetMiddlewareParams, container: Container) {
    const { interceptors, middlewares } = this.getHandlers(data);
    const resolvedInterceptors = interceptors.map((i) => this.resolveHandler(i, container));
    const resolvedMiddlewares = middlewares.map((m) => this.resolveHandler(m, container));
    return {
      interceptors: resolvedInterceptors,
      middlewares: resolvedMiddlewares,
    };
  }

  public resolveHandler(handler: Constructor<IMiddleware>, container: Container) {
    let instance: IMiddleware = container.resolve(handler);
    return this.util.wrap(instance.use.bind(instance));
  }

  public getHandlers(data: GetMiddlewareParams) {
    const interceptors: Constructor<IMiddleware>[] =
      data.scope === 'controller'
        ? Reflect.getMetadata(MetadataKeys.INTERCEPTOR, data.controller) || []
        : Reflect.getMetadata(
            MetadataKeys.INTERCEPTOR,
            data.controller.prototype,
            data.propertyKey
          ) || [];

    const middlewares: Constructor<IMiddleware>[] =
      data.scope === 'controller'
        ? Reflect.getMetadata(MetadataKeys.MIDDLEWARE, data.controller) || []
        : Reflect.getMetadata(
            MetadataKeys.MIDDLEWARE,
            data.controller.prototype,
            data.propertyKey
          ) || [];

    return {
      interceptors,
      middlewares,
    };
  }

  public genCtxMiddleware(constructor: Constructor<any>, pk: string | symbol): Handler {
    return (req, _res, next) => {
      req.ctx = {
        controller: constructor,
        handler: pk,
      };
      next();
    };
  }
}
