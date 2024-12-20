import { HTTPMethods, RouteConfig } from '../lib/types';
import { MetadataKeys } from './metadata-keys';

const generateMethodDecorator =
  (method: HTTPMethods) =>
  (path: string): MethodDecorator =>
  (target, pk) => {
    const routeConfig: RouteConfig = {
      path,
      method,
      symbol: pk,
    };
    Reflect.defineMetadata(MetadataKeys.ROUTE, routeConfig, target, pk);
  };

export const Get = generateMethodDecorator('get');
export const Post = generateMethodDecorator('post');
export const Put = generateMethodDecorator('put');
export const Delete = generateMethodDecorator('delete');
