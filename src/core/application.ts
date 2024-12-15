import { Constructor } from "awilix";
import { RouteManager } from "./route-manager";
import express, { Application as Express, json, RequestHandler, urlencoded } from "express";
import { Container } from "./container";
import { ApplicationRegisterDepenedncies, FeatureModule } from "../lib/types";
import { LoggerService } from "../features/logger.service";
import { IGlobalExceptionHandler } from "./interfaces";
import { EnvService } from "../features/env.service";
import { MetadataKeys } from "../decorators/metadata-keys";
import { Exception } from "./exception";
import { toCamelCase } from "../lib/util";

export class Application {
  
  private controllers: Constructor<any>[] = [];
  private exceptionHandler?: IGlobalExceptionHandler
  private reqHandlers: RequestHandler[] = [];
  private readonly express: Express;

  constructor(
    private readonly routeManager: RouteManager,
    private readonly container: Container,
  ) {
    this.express = express();
  }

  setGlobalExceptionHandler(ExceptionHandler: Constructor<IGlobalExceptionHandler>) {
    this.container.register("ExceptionHandler", ExceptionHandler);
    this.exceptionHandler = this.container.resolve("ExceptionHandler");
  }

  public use(reqHandler: RequestHandler): void {
    this.reqHandlers.push(reqHandler);
  }

  public get<T=any>(target:Constructor<T>):T {
    const parsedName = toCamelCase(target.name);
    return this.container.resolve<T>(parsedName);
  }

  public setModule(module: ApplicationRegisterDepenedncies): void {
    this.container.loadAppDependencies(module);
    module.modules.forEach((module) => {
      const feature: FeatureModule | undefined = Reflect.getMetadata(MetadataKeys.MODULE, module);
      if (feature) this.controllers.push(...feature.controllers);
    });
  }

  public start(): void {
    
    // Config
    this.express.use(json());
    this.express.use(urlencoded({ extended: true }));

    // Request ID
    this.express.use((req, _res, next) => {
      req.headers["x-request-id"] = crypto.randomUUID();
      next();
    });

    // Custom Handlers
    for (const handler of this.reqHandlers) { 
      this.express.use(handler);
    }
    
    // Routes
    this.routeManager.loadRoutes(
      this.express,
      this.controllers,
      this.container
    );

    // 404
    this.express.use("*", (_req, _res, next) => {
      next(new Exception("Resource not found", 404));
    });

    // Global Exception Handler
    if(this.exceptionHandler) this.express.use(this.exceptionHandler.use.bind(this.exceptionHandler));

    // Server
    const PORT = EnvService.get("PORT");
    this.express.listen(PORT, () => LoggerService.info(`Server started on port ${PORT}`));
  }
}
