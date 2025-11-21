import { container, Lifecycle } from "tsyringe";

class ServiceContainer {
    private _container = container;

    public addSingleton(token: symbol | string, value: TClass<unknown>) {
        this._container.register(token, { useClass: value }, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(token: symbol | string, value: TClass<unknown>) {
        this._container.register(token, { useClass: value }, { lifecycle: Lifecycle.Transient });
    }

    public addScoped(token: symbol | string, value: TClass<unknown>) {
        this._container.register(
            token,
            { useClass: value },
            { lifecycle: Lifecycle.ContainerScoped },
        );
    }

    public resolveNullable<TInstance>(token: symbol | string): TInstance | null {
        try {
            return this._container.resolve(token) as TInstance;
        } catch {
            return null;
        }
    }

    public resolveStrict<TInstance>(token: symbol | string): TInstance {
        return this._container.resolve(token) as TInstance;
    }

    public createScope() {
        const serviceContainer = new ServiceContainer();
        serviceContainer._container = this._container.createChildContainer();
        return serviceContainer;
    }

    public disposeScope() {
        this._container.dispose();
    }
}

export default new ServiceContainer();
