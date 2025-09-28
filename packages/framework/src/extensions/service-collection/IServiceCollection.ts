export interface IServiceCollection {
    addSingleton(token: symbol | string, service: Class): void;
    addTransient(token: symbol | string, service: Class): void;
    addScoped(token: symbol | string, service: Class): void;
    resolveInstance<TInstance = object>(token: symbol | string): TInstance;
    contains(token: symbol | string): boolean;
}
