import { asClass, AwilixContainer, createContainer } from "awilix";
import { ApplicationRegisterDepenedncies, Constructor, FeatureModule } from "../lib/types";
import { MetadataKeys } from "../decorators/metadata-keys";
import { toCamelCase } from "../lib/util";

export class Container {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({ injectionMode: "CLASSIC" });
  }

  getContainer(): AwilixContainer {
    return this.container;
  }

  resolve<T=any>(name: string): T {
    const parsedName = toCamelCase(name);
    return this.container.resolve(parsedName);
  }

  loadAppDependencies(module:ApplicationRegisterDepenedncies){
    if(module.middlewares) this.registerMany(module.middlewares);
    if(module.providers) this.registerMany(module.providers);
    if(module.modules) this.loadModule(module.modules);
  }

  loadModule(modules:Constructor<any>[]) {
    for(const module of modules) {
      const feature:FeatureModule|undefined = Reflect.getMetadata(MetadataKeys.MODULE, module);
      if(feature) {
        this.registerMany(feature.controllers);
        this.registerMany(feature.services);
      }
    }
  }

  registerMany(dependencies: Constructor<any>[]):void{
    for(const dependency of dependencies) {
      const name = dependency.name;
      this.register(name, dependency);
    }
  }

  register<T>(name: string, value: Constructor<T>): void {
    const parsedName = toCamelCase(name);
    this.container.register(parsedName, asClass(value, {lifetime:"SINGLETON"}));
  }

}
