import { IContainer } from "./IContainer";
import { container, DependencyContainer, injectable, Lifecycle } from "tsyringe";

class Container implements IContainer {
    private _container: DependencyContainer;

    public constructor(diContainer: DependencyContainer = container) {
        this._container = diContainer;
    }

    public addScoped(key: string | symbol, useClass: TClass<object>): void {
        this._container.register(
            key,
            { useClass: useClass },
            { lifecycle: Lifecycle.ContainerScoped },
        );
    }

    public addSingleton(key: string | symbol, useClass: TClass<object>): void {
        this._container.register(key, { useClass: useClass }, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(key: string | symbol, useClass: TClass<object>): void {
        this._container.register(key, { useClass: useClass }, { lifecycle: Lifecycle.Transient });
    }

    public addValue(key: string | symbol, value: object): void {
        this._container.register(key, { useValue: value });
    }

    public contains(key: string | symbol): boolean {
        return this._container.isRegistered(key, false);
    }

    public markAsInjectable(target: TClass<object>): void {
        injectable()(target);
    }

    public resolveInstance<TInstance extends object>(key: string | symbol): TInstance {
        return this._container.resolve(key);
    }

    public createScope(): IContainer {
        return new Container(container.createChildContainer());
    }

    public dispose(): void {
        this._container.dispose();
    }
}

export const GlobalContainer = new Container();
