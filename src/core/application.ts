import { RouteManager } from './route.manager';
import express, {
  ErrorRequestHandler,
  Application as Express,
  RequestHandler,
} from 'express';
import { Container } from './container';
import { Constructor } from '../lib/types';
import { IGlobalExceptionHandler, IMiddleware } from './interfaces';
import { Exception } from './exception';

export class Application {
  private exceptionHandler?: ErrorRequestHandler;
  private reqHandlers: RequestHandler[] = [];
  private readonly express: Express;

  constructor(
    private readonly routeManager: RouteManager,
    private readonly container: Container
  ) {
    this.express = express();
  }

  setGlobalExceptionHandler(
    ExceptionHandler: Constructor<IGlobalExceptionHandler>
  ) {
    this.container.register(ExceptionHandler);
    const instance = this.container.resolve(ExceptionHandler);
    this.exceptionHandler = instance.use.bind(instance);
  }

  public use(reqHandler: RequestHandler | Constructor<IMiddleware>): void {
    if (
      typeof reqHandler === 'function' &&
      reqHandler.prototype &&
      reqHandler.prototype.use
    ) {
      const instance = this.container.resolve(
        reqHandler as Constructor<IMiddleware>
      );
      this.reqHandlers.push(instance.use.bind(instance));
    } else this.reqHandlers.push(reqHandler as RequestHandler);
  }

  public get<T = any>(target: Constructor<T>): T {
    return this.container.resolve<T>(target);
  }

  public start(port: number, callback?: () => void): void {
    // Custom Handlers
    for (const handler of this.reqHandlers) {
      this.express.use(handler);
    }

    // Routes
    this.routeManager.loadRoutes(this.express, this.container);

    // 404
    this.express.use('*', (_req, _res, next) => {
      next(new Exception('Resource not found', 404));
    });

    // Global Exception Handler
    if (this.exceptionHandler) this.express.use(this.exceptionHandler);

    // Server
    this.express.listen(port, callback);
  }
}
