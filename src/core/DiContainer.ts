import { container, DependencyContainer, Lifecycle } from "tsyringe";
import { TConstructor } from "../types";

export const DI_METADATA_KEY = Symbol("di:constructor_injection");

/**
 * Wrapper around the tsyringe dependency container.
 *
 * Provides simplified methods for registering and resolving dependencies
 * within the framework.
 */
class DiContainer {
    private readonly _container: DependencyContainer;

    public constructor() {
        this._container = container;
    }

    /**
     * Registers a class as a singleton.
     *
     * The same instance will be returned on every resolution.
     *
     * @param token Unique identifier for the dependency.
     * @param implementation The class constructor to register.
     */
    public addSingleton(token: string, implementation: TConstructor) {
        this._container.register(token, implementation, { lifecycle: Lifecycle.Singleton });
    }

    /**
     * Registers a class as transient.
     *
     * A new instance will be created on each resolution.
     *
     * @param token Unique identifier for the dependency.
     * @param implementation The class constructor to register.
     */
    public addTransient(token: string, implementation: TConstructor) {
        this._container.register(token, implementation, { lifecycle: Lifecycle.Transient });
    }

    /**
     * Resolves a dependency by its token.
     *
     * @param token Identifier of the dependency to resolve.
     * @returns The resolved instance.
     */
    public resolve<T>(token: string): T {
        return this._container.resolve(token);
    }

    /**
     * Resolves a dependency by its token.
     *
     * @param Class Class
     * @returns The resolved instance.
     */
    public resolveWithInjections(Class: TConstructor) {
        const injections = Reflect.getMetadata(DI_METADATA_KEY, Class) as
            | { token: string; paramIndex: number }[]
            | undefined;

        const args: unknown[] = [];
        for (const inj of injections || []) {
            args[inj.paramIndex] = this.resolve(inj.token);
        }

        return new Class(...args);
    }
}

export default new DiContainer();
