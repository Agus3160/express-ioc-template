import { Container } from "./container";
import { Application } from "./application";
import { RouteManager } from "./route-manager";
import { ApplicationRegisterDepenedncies } from "../lib/types";

export class ApplicationFactory {
  public static run(
    module: ApplicationRegisterDepenedncies,
    callback?: (app: Application) => void
  ) {
    const container = new Container();
    const routeManager = new RouteManager();
    const app = new Application(routeManager, container);
    app.setModule(module);
    if (callback) callback(app);
    app.start();
  }
}
