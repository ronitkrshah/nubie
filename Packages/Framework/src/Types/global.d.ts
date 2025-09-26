declare global {
    type Class<TInstance = object> = new (...args: any[]) => TInstance;
    type AbstractClass<TInstance = object> = abstract new (...args: any[]) => TInstance;
}

export {};
