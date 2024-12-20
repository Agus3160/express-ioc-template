import { envValues } from '../configuration/env.config';
import { EnvType } from '../configuration/env.config';
import { Injectable } from '../decorators/di.decorator';

@Injectable()
export class EnvService {
  private env: EnvType = envValues;

  public get<Key extends keyof EnvType>(key: Key): EnvType[Key] {
    return this.env[key];
  }
}
