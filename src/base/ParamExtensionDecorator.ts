import { NextFunction, Request, Response } from "express";
import AppState from "../AppState";

/**
 * Abstract base class for parameter-level extension decorators.
 *
 * Used to inject or transform method parameters during request handling.
 */
export default abstract class ParamExtensionDecorator {
    /** Index of the parameter being decorated. */
    private _paramIndex!: number;

    /** Gets the index of the decorated parameter. */
    public get paramIndex() {
        return this._paramIndex;
    }

    /**
     * Sets the internal context for the decorator instance.
     *
     * @param paramIndex Index of the parameter in the method signature.
     */
    private setContext(paramIndex: number) {
        this._paramIndex = paramIndex;
    }

    /**
     * Executes the decorator logic for the parameter.
     *
     * Called during request handling. Must be implemented by subclasses.
     */
    abstract executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown>;

    /**
     * Factory for creating parameter extension decorators.
     *
     * Registers the decorator instance in the global AppState under a method-specific key.
     *
     * @param MethodDecorator The decorator class to instantiate.
     * @returns A decorator function to apply to method parameters.
     */
    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => ParamExtensionDecorator) {
        return function (...params: T) {
            return function (target: object, methodName: string, paramIndex: number) {
                const decoratorInstance = new MethodDecorator(...params);
                decoratorInstance.setContext(paramIndex);
                AppState.registerParamExtension(`${target.constructor.name}_${methodName}`, decoratorInstance);
            };
        };
    }
}
