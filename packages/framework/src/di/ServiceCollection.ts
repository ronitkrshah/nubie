import { container, injectable, Lifecycle } from "tsyringe";
import { TConstructor } from "../types";
import type { IServiceCollection } from "./IServiceCollection";

class ServiceCollection implements IServiceCollection {
    public addSingleton(key: string | symbol, classImpl: TConstructor): void {
        injectable()(classImpl);
        container.register(key, { useClass: classImpl }, { lifecycle: Lifecycle.Singleton });
    }

    public addTransient(key: string | symbol, classImpl: TConstructor): void {
        injectable()(classImpl);
        container.register(key, { useClass: classImpl }, { lifecycle: Lifecycle.Transient });
    }

    public addScoped(key: string | symbol, classImpl: TConstructor): void {
        injectable()(classImpl);
        container.register(key, { useClass: classImpl }, { lifecycle: Lifecycle.ContainerScoped });
    }

    public isRegistered(key: string | symbol): boolean {
        return container.isRegistered(key);
    }
}

export default new ServiceCollection();
