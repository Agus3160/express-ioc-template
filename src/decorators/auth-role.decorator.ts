import { MetadataKeys } from './metadata-keys';

export const HasRole = (...roles: string[]) => {
  return (
    target: any,
    propertyKey?: string | symbol,
    _descriptor?: PropertyDescriptor
  ) => {
    if (propertyKey)
      Reflect.defineMetadata(MetadataKeys.ROL, roles, target, propertyKey);
    else Reflect.defineMetadata(MetadataKeys.ROL, roles, target);
  };
};
