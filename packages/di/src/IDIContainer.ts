export type TClass<TInstance extends object> = new (...args: any[]) => TInstance;

export interface IDIContainer {
    addSingleton(key: string | symbol, useClass: TClass<object>): void;

    addTransient(key: string | symbol, useClass: TClass<object>): void;

    addScoped(key: string | symbol, useClass: TClass<object>): void;

    addValue(key: string | symbol, value: object): void;

    contains(key: string | symbol): boolean;

    markAsInjectable(target: TClass<object>): void;

    resolveInstance<TInstance extends object>(key: string | symbol): TInstance;

    createScope(): IDIContainer;

    dispose(): void;
}
