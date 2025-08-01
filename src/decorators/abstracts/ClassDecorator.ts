import AppContext from "../../AppContext";
import { TClass } from "../../types";
import { TMethodMetadata } from "./MethodDecorator";

export type TClassMetadata = {
    endpoint: string;
    apiVersion?: number;
    methods?: Record<string, TMethodMetadata>;
    className: string;
    constructorInjections?: {
        token: string;
        paramIndex: number;
    }[];
};

export default abstract class ClassDecorator {
    public static METADATA_KEY = Symbol("api:class");

    protected _target!: TClass;

    abstract executeAsync(): Promise<void>;

    private setContext(target: TClass) {
        this._target = target;
    }

    public static updateMetadata(target: TClass, metadata: Partial<TClassMetadata>) {
        const existingMetadata = ClassDecorator.getMetadata(target);
        Reflect.defineMetadata(ClassDecorator.METADATA_KEY, { ...existingMetadata, ...metadata }, target);
    }

    public static getMetadata(target: TClass): TClassMetadata {
        return Reflect.getOwnMetadata(ClassDecorator.METADATA_KEY, target) || {};
    }

    public static createDecorator<T extends any[]>(ClassDecorator: new (...args: T) => ClassDecorator) {
        return function (...params: T) {
            return function (target: TClass) {
                const decoratorInstance = new ClassDecorator(...params);
                decoratorInstance.setContext(target);
                decoratorInstance.executeAsync().then(() => {
                    AppContext.addClassDecorator(target);
                });
            };
        };
    }
}
