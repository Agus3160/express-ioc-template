import { FeatureModule } from "../lib/types";
import { MetadataKeys } from "./metadata-keys";

export const Module =
  (config: FeatureModule): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(MetadataKeys.MODULE, config, target);
  };
