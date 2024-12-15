import { MetadataKeys } from "./metadata-keys";

export const Controller =
  (prefix: string): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(MetadataKeys.CONTROLLER, prefix, target);
  };
