import { TConstructor } from "../types";

export interface IServiceContext {
    addSingleton(key: string | symbol, classImpl: TConstructor): void;
    addTransient(key: string | symbol, classImpl: TConstructor): void;
    addScoped(key: string | symbol, classImpl: TConstructor): void;
}
