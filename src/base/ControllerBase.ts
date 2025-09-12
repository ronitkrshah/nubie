import AppState from "../AppState";
import { TConstructor } from "../types";

/**
 * Abstract base class for all API controllers.
 *
 * Provides lifecycle hooks and decorator utilities for controller registration.
 */
export default abstract class ControllerBase {
    /** Metadata key used to identify controller classes. */
    public static readonly METADATA_KEY = Symbol("api:controller");

    /** The target constructor associated with the controller. */
    public _target!: TConstructor;

    /**
     * Hook for registering controller routes and middleware.
     * Must be implemented by subclasses.
     */
    public abstract registerControllerAsync(): Promise<void>;

    /**
     * Creates a decorator for registering a controller class.
     *
     * Instantiates the controller with provided parameters and stores it in the global AppState.
     *
     * @param apiControllerClass The controller class to instantiate and register.
     * @returns A decorator function to apply to the target class.
     */
    public static createDecorator<T extends any[]>(apiControllerClass: new (...args: T) => ControllerBase) {
        return function (...params: T) {
            return function (target: TConstructor) {
                const controllerInstance = new apiControllerClass(...params);
                controllerInstance._target = target;
                AppState.controllers.push(controllerInstance);
            };
        };
    }
}
