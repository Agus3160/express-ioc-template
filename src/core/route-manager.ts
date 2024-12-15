import { Constructor } from "awilix";
import { Application, NextFunction, Request, Response, Router } from "express";
import { Container } from "./container";
import { MetadataKeys } from "../decorators/metadata-keys";
import { MiddlewareType, RouteConfig } from "../lib/types";
import { LoggerService } from "../features/logger.service";
import { IMiddleware } from "./interfaces";

export class RouteManager {

  loadRoutes(app:Application, controllers: Constructor<any>[], container: Container) {
    for (const controller of controllers) {
      const router = Router();
      const routePrefix = this.getControllerPrefix(controller);
      const propertiesKey = Object.getOwnPropertyNames(controller.prototype);
      const controllerMiddleware:MiddlewareType[] = this.configClassMiddleware(controller, container);
      const controllerInstance = container.resolve(controller.name);
      LoggerService.info(`LOADING ROUTE [ ${routePrefix} ] . . .`);
      for (const propertyKey of propertiesKey) {
        const route:RouteConfig = Reflect.getMetadata(MetadataKeys.ROUTE, controller.prototype, propertyKey);
        if(route) { 
          const { path, method, symbol } = route;
          const middlewares = this.configHandlerMiddleware(controller, propertyKey, container);
          const handler = this.configHandler(controllerInstance, propertyKey);
          router[method](path, this.injectCtx(controller, symbol), ...middlewares, handler);
          LoggerService.info(`PATH [ ${method.toUpperCase()} ${path} ] LOADED!`);
        }
      }
      app.use(routePrefix,...controllerMiddleware, router);
      LoggerService.info(`ROUTE [ ${routePrefix} ] LOADED SUCCESSFULLY!`);
    }
  }

  private getControllerPrefix(constructor:Constructor<any>):string {
    let prefix:string = Reflect.getMetadata(MetadataKeys.CONTROLLER, constructor);
    if(!prefix) throw new Error("Controller metadata not found");
    return prefix
  }

  private configHandler(instance:any, propertyKey:string):MiddlewareType {
    return this.wrapper(instance[propertyKey].bind(instance));
  }

  private configClassMiddleware(constructor:Constructor<any>, container:Container):MiddlewareType[] {
    let middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, constructor) || [];
    let resolved:MiddlewareType[] = [];
    for(const middleware of middlewares) {
      let instance:IMiddleware = container.resolve(middleware);
      resolved.push(this.wrapper(instance.use.bind(instance)));
    }
    return resolved
  }

  private configHandlerMiddleware(constructor:Constructor<any>, propertyKey:string, container:Container):MiddlewareType[] {
    let middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, constructor.prototype, propertyKey) || [];
    let resolved:MiddlewareType[] = [];
    for(const middleware of middlewares) {
      let instance:IMiddleware = container.resolve(middleware);
      resolved.push(this.wrapper(instance.use.bind(instance)));
    }
    return resolved
  }

  private injectCtx(controller: Constructor<any>, handler:symbol|string) {
    return (req:Request, _res:Response, next:NextFunction) => {
      req.ctx = { controller, handler };
      next();
    }
  }

  private wrapper(fn:(req:Request, res:Response, next:NextFunction)=>void|Promise<void>) {
    return async (req:Request, res:Response, next:NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

}