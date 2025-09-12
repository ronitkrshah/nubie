import { RequestHandler } from "express";
import ControllerBase from "./ControllerBase";
import { TApiControllerMetadata } from "../decorators/class-decorators";

export type TMethodMetadata = {
    endpoint: string;
    apiVersion?: number;
    httpMethod: "get" | "post" | "put" | "patch" | "delete";
    body?: Record<string, string>;
    middlewares?: RequestHandler[];
};

export default abstract class MethodDecorator {
    public static readonly METADATA_KEY = Symbol("api:method");

    protected _target!: object;
    protected _methodName!: string;
    protected _descriptor!: PropertyDescriptor;

    abstract executeAsync(): Promise<void>;

    private setContext(target: object, methodName: string, descriptor: PropertyDescriptor) {
        this._target = target;
        this._methodName = methodName;
        this._descriptor = descriptor;
    }

    protected getMethodMetadata() {
        const existingMetadata: Record<string, TMethodMetadata> =
            Reflect.getMetadata(MethodDecorator.METADATA_KEY, this._target) || {};
        return existingMetadata || {};
    }

    protected updateMethodMetadata(metadata: Partial<TMethodMetadata>) {
        const existingMetadata = this.getMethodMetadata();
        Reflect.defineMetadata(
            MethodDecorator.METADATA_KEY,
            {
                ...existingMetadata,
                [this._methodName]: {
                    ...(existingMetadata[this._methodName] || {}),
                    ...metadata,
                },
            },
            this._target,
        );
    }

    private addMethodToController() {
        const existingMetadata: TApiControllerMetadata = Reflect.getMetadata(
            ControllerBase.METADATA_KEY,
            this._target.constructor,
        );

        const methodMetadata = this.getMethodMetadata();

        Reflect.defineMetadata(
            ControllerBase.METADATA_KEY,
            {
                ...existingMetadata,
                methods: {
                    ...(existingMetadata?.methods || {}),
                    [this._methodName]: {
                        ...(existingMetadata?.methods?.[this._methodName] || {}),
                        ...methodMetadata[this._methodName],
                    },
                },
            },
            this._target.constructor,
        );
    }

    public static updateMethodMetadata(target: object, methodName: string, metadata: Partial<TMethodMetadata>) {
        const existingMetadata: Record<string, TMethodMetadata> =
            Reflect.getMetadata(MethodDecorator.METADATA_KEY, target) || {};
        Reflect.defineMetadata(
            MethodDecorator.METADATA_KEY,
            {
                ...existingMetadata,
                [methodName]: {
                    ...(existingMetadata[methodName] || {}),
                    ...metadata,
                },
            },
            target,
        );
    }

    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => MethodDecorator) {
        return function (...params: T) {
            return function (target: object, methodName: string, descriptor: PropertyDescriptor) {
                const decoratorInstance = new MethodDecorator(...params);
                decoratorInstance.setContext(target, methodName, descriptor);
                decoratorInstance.executeAsync().then(() => {
                    decoratorInstance.addMethodToController();
                });
            };
        };
    }
}
