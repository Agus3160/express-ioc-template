import { envValues } from "../configuration/env.config";
import { EnvType } from "../configuration/env.config";

export class EnvService {
  private static env: EnvType = envValues;

  public static get<Key extends keyof EnvType>(key: Key): EnvType[Key] {
    return this.env[key];
  }
}
