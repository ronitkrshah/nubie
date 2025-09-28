import { container, injectable, Lifecycle } from "tsyringe";
import type { IServiceCollection } from "./IServiceCollection";

class ServiceCollection implements IServiceCollection {
    private readonly _container = container;

    public addSingleton(token: string | symbol, service: Class): void {
        injectable()(service);
        this._container.register(token, { useClass: service }, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(token: string | symbol, service: Class): void {
        injectable()(service);
        this._container.register(token, { useClass: service }, { lifecycle: Lifecycle.Transient });
    }

    public addScoped(token: string | symbol, service: Class): void {
        injectable()(service);
        this._container.register(token, { useClass: service }, { lifecycle: Lifecycle.ContainerScoped });
    }

    public resolveInstance<TInstance = object>(token: symbol | string): TInstance {
        return this._container.resolve(token);
    }

    public contains(token: string | symbol): boolean {
        return this._container.isRegistered(token);
    }
}

export default new ServiceCollection();
