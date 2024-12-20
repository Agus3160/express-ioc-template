import { Container } from './container';
import { Application } from './application';
import { RouteManager } from './route.manager';
import { AppFactoryParams } from '../lib/types';
import { HandlerManager } from './handler.manager';
import { UtilService } from '../features/util.service';

export class ApplicationFactory {
  public static run(params: AppFactoryParams) {
    // List all dependencies
    const { controllers, providers, middlewares } = params;
    const dependencies = [
      ...providers,
      ...middlewares,
      ...controllers,
      RouteManager,
      HandlerManager,
      UtilService,
    ];

    // Create the container and register the dependencies
    const container = new Container();
    container.registerMany(dependencies);

    // Resolve Route Manager and load the controllers
    const routeManager = container.resolve(RouteManager);
    routeManager.loadControllers(...controllers);

    // Create and return the main app.
    const app = new Application(routeManager, container);
    return app;
  }
}
