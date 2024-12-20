import { Constructor } from "../lib/types";
import { Container as InversifyContainer } from "inversify";

export class Container {
  private readonly container: InversifyContainer;

  constructor() {
    this.container = new InversifyContainer();
  }

  getContainer(): InversifyContainer {
    return this.container;
  }

  resolve<T=any>(Dependency: Constructor<T>): T {
    return this.container.resolve(Dependency);
  }

  registerMany(Dependencies: Constructor<any>[]):void{
    for(const Dependency of Dependencies) {
      this.register(Dependency);
    }
  }

  register<T>(Dependency: Constructor<T>): void {
    if(this.container.isBound(Dependency)) return;
    this.container.bind(Dependency.name).to(Dependency).inSingletonScope();
  }

}
