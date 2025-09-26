import type { TConstructor } from "../types";

export interface IServiceCollection {
    addSingleton(key: string | symbol, classImpl: TConstructor): void;
    addTransient(key: string | symbol, classImpl: TConstructor): void;
    addScoped(key: string | symbol, classImpl: TConstructor): void;
    isRegistered(key: string | symbol): boolean;
}
