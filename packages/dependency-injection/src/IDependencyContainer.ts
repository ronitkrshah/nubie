import type { Lifecycle } from "tsyringe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TClass = new (...args: any[]) => object;

export interface IDependencyContainer {
    registerClass(token: string, ctor: TClass, lifecycle?: Lifecycle): void;
    markAsInjectable(ctor: TClass): void;
    contains(token: string): boolean;
    resolveInstance<TInstance extends object>(token: string): TInstance | null;
}
