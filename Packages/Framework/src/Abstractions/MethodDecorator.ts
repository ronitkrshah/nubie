import type { RequestHandler } from "express";
import ControllerBase from "./Controller/ControllerBase";
import type { TApiControllerMetadata } from "../Decorators/ClassDecorators";

export type TMethodMetadata = {
    endpoint: string;
    apiVersion?: number;
    httpMethod: "get" | "post" | "put" | "patch" | "delete";
    body?: Record<string, string>;
    middlewares?: RequestHandler[];
};

/**
 * Abstract abstractions class for method-level decorators.
 *
 * Handles metadata registration and controller integration for decorated methods.
 */
export default abstract class MethodDecorator {
    /** Metadata key used to store method-level metadata. */
    public static readonly METADATA_KEY = Symbol("api:method");

    /** The class instance where the method is defined. */
    protected _target!: object;

    /** The name of the method being decorated. */
    protected _methodName!: string;

    /** The method's property descriptor. */
    protected _descriptor!: PropertyDescriptor;

    /**
     * Hook for executing decorator logic.
     * Must be implemented by subclasses.
     */
    abstract executeAsync(): Promise<void>;

    /**
     * Sets the internal context for the decorator instance.
     *
     * @param target The class prototype.
     * @param methodName The name of the method being decorated.
     * @param descriptor The method's property descriptor.
     */
    private setContext(target: object, methodName: string, descriptor: PropertyDescriptor) {
        this._target = target;
        this._methodName = methodName;
        this._descriptor = descriptor;
    }

    /**
     * Retrieves existing method metadata for the current target.
     *
     * @returns A map of method names to their metadata.
     */
    protected getMethodMetadata() {
        const existingMetadata: Record<string, TMethodMetadata> =
            Reflect.getMetadata(MethodDecorator.METADATA_KEY, this._target) || {};
        return existingMetadata || {};
    }

    /**
     * Updates metadata for the current method.
     *
     * @param metadata Partial metadata to merge with existing values.
     */
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

    /**
     * Adds the method and its metadata to the controller-level metadata store.
     */
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

    /**
     * Static utility to update metadata for a specific method.
     *
     * @param target The class prototype.
     * @param methodName The name of the method.
     * @param metadata Partial metadata to merge.
     */
    public static updateMethodMetadata(
        target: object,
        methodName: string,
        metadata: Partial<TMethodMetadata>,
    ) {
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

    /**
     * Factory for creating method decorators from a subclass of MethodDecorator.
     *
     * @param MethodDecorator The decorator class to instantiate.
     * @returns A decorator function to apply to methods.
     */
    public static createDecorator<T extends unknown[]>(
        MethodDecorator: new (...args: T) => MethodDecorator,
    ) {
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
