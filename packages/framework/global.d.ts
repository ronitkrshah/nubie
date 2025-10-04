declare global {
    type TClass<TArgs = any[], TInstance = object> = new (...args: TArgs) => TInstance;
    type THttpMethod = "get" | "post" | "put" | "delete" | "patch";
}

export {};
