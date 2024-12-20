import { Application, NextFunction, Request, Response, Router } from 'express';
import { Container } from './container';
import { MetadataKeys } from '../decorators/metadata-keys';
import { Constructor, MiddlewareType, RouteConfig } from '../lib/types';
import { LoggerService } from '../features/logger.service';
import { Inject, Injectable } from '../decorators/di.decorator';
import { HandlerManager } from './handler.manager';
import { UtilService } from '../features/util.service';

@Injectable()
export class RouteManager {
  private readonly controllers: Constructor<any>[] = [];

  constructor(
    @Inject(HandlerManager) private readonly handlerUtil: HandlerManager,
    @Inject(UtilService) private readonly util: UtilService,
    @Inject(LoggerService) private readonly logger:LoggerService
  ) {}

  public loadControllers(...controllers: Constructor<any>[]) {
    this.controllers.push(...controllers);
  }

  loadRoutes(app: Application, container: Container) {
    for (const controller of this.controllers) {
      const router = Router();
      const prefix = this.getPrefix(controller);
      const { interceptors, middlewares } = this.handlerUtil.resolveAllHandlers(
        { scope: 'controller', controller },
        container
      );
      this.configPaths(router, controller, container);
      app.use(prefix, ...middlewares, router, ...interceptors);
      this.logger.info(`ROUTE [ ${prefix} ] LOADED SUCCESSFULLY!`);
    }
  }

  private getPrefix(constructor: Constructor<any>): string {
    let prefix: string = Reflect.getMetadata(MetadataKeys.CONTROLLER, constructor);
    if (!prefix) throw new Error('Controller metadata not found');
    return prefix;
  }

  private configPaths(router: Router, controller: Constructor<any>, container: Container) {
    const pks = Object.getOwnPropertyNames(controller.prototype);
    const instance = container.resolve(controller);
    for (const pk of pks) {
      const pathConifg = this.getPathConfig(controller, pk);
      if (pathConifg) {
        const { path, method, symbol } = pathConifg;
        const { middlewares, interceptors } = this.handlerUtil.resolveAllHandlers(
          { scope: 'handler', controller, propertyKey: pk },
          container
        );
        const handler = this.configPath(instance, pk);
        router[method](
          path,
          this.injectCtx(controller, symbol),
          ...middlewares,
          handler,
          ...interceptors
        );
        this.logger.debug(`PATH [ ${method.toUpperCase()} ${path} ] LOADED!`);
      }
    }
  }

  private configPath(instance: any, propertyKey: string): MiddlewareType {
    return this.util.wrap(instance[propertyKey].bind(instance));
  }

  private getPathConfig(controller: Constructor<any>, pk: string | symbol) {
    const route = Reflect.getMetadata(MetadataKeys.ROUTE, controller.prototype, pk) as
      | RouteConfig
      | undefined;
    return route;
  }

  private injectCtx(controller: Constructor<any>, handler: symbol | string) {
    return (req: Request, _res: Response, next: NextFunction) => {
      req.ctx = { controller, handler };
      next();
    };
  }
}
