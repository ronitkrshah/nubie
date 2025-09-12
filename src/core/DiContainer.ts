import { container, DependencyContainer, Lifecycle } from "tsyringe";
import { TConstructor } from "../types";

class DiContainer {
    private readonly _container: DependencyContainer;

    public constructor() {
        this._container = container;
    }

    public addSingleton(token: string, implementation: TConstructor) {
        this._container.register(token, implementation, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(token: string, implementation: TConstructor) {
        this._container.register(token, implementation, { lifecycle: Lifecycle.Transient });
    }

    public resolve<T>(token: string): T {
        return this._container.resolve(token);
    }
}

export default new DiContainer();
