import { container, injectable, Lifecycle } from "tsyringe";
import { TConstructor } from "../types";
import { IServiceContext } from "./IServiceContext";

export default class ServiceContext implements IServiceContext {
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
}
