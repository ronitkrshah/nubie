import { container, InjectionToken, Lifecycle } from "tsyringe";

class ServiceContainer {
    private _container = container;

    public addSingleton(token: InjectionToken, value: TClass<unknown>) {
        this._container.register(token, { useClass: value }, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(token: InjectionToken, value: TClass<unknown>) {
        this._container.register(token, { useClass: value }, { lifecycle: Lifecycle.Transient });
    }

    public addScoped(token: InjectionToken, value: TClass<unknown>) {
        this._container.register(
            token,
            { useClass: value },
            { lifecycle: Lifecycle.ResolutionScoped },
        );
    }

    public resolveNullable<TInstance>(value: InjectionToken): TInstance | null {
        try {
            return this._container.resolve(value) as TInstance;
        } catch {
            return null;
        }
    }

    public resolveStrict<TInstance>(token: InjectionToken): TInstance {
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
