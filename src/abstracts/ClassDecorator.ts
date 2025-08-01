import { TClass } from "../types";
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
    protected _target!: TClass;

    public setTarget(target: TClass) {
        this._target = target;
    }

    public static updateMetadata(key: symbol, target: TClass, metadata: Partial<TClassMetadata>) {
        const existingMetadata = ClassDecorator.getMetadata(key, target);
        Reflect.defineMetadata(key, { ...existingMetadata, ...metadata }, target);
    }

    public static getMetadata(key: symbol, target: TClass): TClassMetadata {
        return Reflect.getOwnMetadata(key, target) || {};
    }
}
