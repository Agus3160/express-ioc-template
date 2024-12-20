import { Injectable } from './di.decorator';
import { MetadataKeys } from './metadata-keys';

export const Controller =
  (prefix: string): ClassDecorator =>
  (target) => {
    Injectable()(target);
    Reflect.defineMetadata(MetadataKeys.CONTROLLER, prefix, target);
  };
