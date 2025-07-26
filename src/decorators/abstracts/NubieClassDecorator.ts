import AppContext from "../../AppContext";
import { TClass } from "../../types";
import { TMethodMetadata } from "./NubieMethodDecorator";

export type TClassMetadata = {
    endpoint: string;
    apiVersion?: number;
    methods?: Record<string, TMethodMetadata>;
    className: string;
};

export default abstract class NubieClassDecorator {
    public static METADATA_KEY = Symbol("api:class");

    protected _target!: TClass;

    abstract executeAsync(): Promise<void>;

    private setContext(target: TClass) {
        this._target = target;
    }

    protected updateMetadata(metadata: Partial<TClassMetadata>) {
        const existingMetadata = NubieClassDecorator.getMetadata(this._target);
        Reflect.defineMetadata(NubieClassDecorator.METADATA_KEY, { ...existingMetadata, ...metadata }, this._target);
    }

    public static getMetadata(target: TClass): TClassMetadata {
        return Reflect.getOwnMetadata(NubieClassDecorator.METADATA_KEY, target) || {};
    }

    public static createDecorator<T extends any[]>(ClassDecorator: new (...args: T) => NubieClassDecorator) {
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
