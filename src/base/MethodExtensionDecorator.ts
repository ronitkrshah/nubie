import { NextFunction, Request, Response } from "express";
import AppState from "../AppState";

/**
 * Abstract base class for method-level extension decorators.
 *
 * Used to attach runtime behavior (e.g. logging, auth, validation) to controller methods.
 */
export default abstract class MethodExtensionDecorator {
    /**
     * Executes the extension logic for a controller method.
     *
     * Called during request handling. Must be implemented by subclasses.
     */
    abstract executeAsync(req: Request, res: Response, next: NextFunction): Promise<void>;

    /**
     * Factory for creating method extension decorators.
     *
     * Registers the decorator instance in the global AppState under a method-specific key.
     *
     * @param MethodDecorator The decorator class to instantiate.
     * @returns A decorator function to apply to controller methods.
     */
    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => MethodExtensionDecorator) {
        return function (...params: T) {
            return function (target: object, methodName: string, descriptor: PropertyDescriptor) {
                const decoratorInstance = new MethodDecorator(...params);
                AppState.registerMethodExtension(`${target.constructor.name}_${methodName}`, decoratorInstance);
            };
        };
    }
}
