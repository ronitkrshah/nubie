declare global {
    type TClass<TArgs = any[], TInstance = object> = new (...args: TArgs) => TInstance;
}

export {};
