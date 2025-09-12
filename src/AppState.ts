import { ControllerBase, MethodExtensionDecorator, ParamExtensionDecorator } from "./base";
import { Express } from "express";

/**
 * Manages global application state including Express instance,
 * registered controllers, and method/parameter decorators.
 */
class AppState {
    /** The Express application instance used by the framework. */
    public expressApp!: Express;

    /** List of registered controller instances. */
    public readonly controllers: ControllerBase[] = [];

    /** Internal map of method-level decorators keyed by identifier. */
    private _extensionMethods = new Map<string, MethodExtensionDecorator[]>();

    /** Internal map of parameter-level decorators keyed by identifier. */
    private _extensionParams = new Map<string, ParamExtensionDecorator[]>();

    /**
     * Retrieves all method decorators associated with a given key.
     *
     * @param key Identifier for the method.
     * @returns Array of method decorators, or an empty array if none are registered.
     */
    public getMethodExtensions(key: string) {
        const savedValue = this._extensionMethods.get(key);
        return savedValue || [];
    }

    /**
     * Retrieves all parameter decorators associated with a given key.
     *
     * @param key Identifier for the parameter.
     * @returns Array of parameter decorators, or an empty array if none are registered.
     */
    public getParamExtensions(key: string) {
        const savedValue = this._extensionParams.get(key);
        return savedValue || [];
    }

    /**
     * Registers a method-level decorator under the specified key.
     *
     * @param key Identifier for the method.
     * @param decorator The method decorator to register.
     */
    public registerMethodExtension(key: string, decorator: MethodExtensionDecorator) {
        const savedValue = this._extensionMethods.get(key);
        this._extensionMethods.set(key, [...(savedValue || []), decorator]);
    }

    /**
     * Registers a parameter-level decorator under the specified key.
     *
     * @param key Identifier for the parameter.
     * @param decorator The parameter decorator to register.
     */
    public registerParamExtension(key: string, decorator: ParamExtensionDecorator) {
        const savedValue = this._extensionParams.get(key);
        this._extensionParams.set(key, [...(savedValue || []), decorator]);
    }
}

export default new AppState();
