import { container, DependencyContainer } from "tsyringe";

/**
 * A singleton-based wrapper around the `tsyringe` dependency injection container.
 *
 * This class provides:
 * - A global singleton container instance (via {@link getInstance}).
 * - The ability to create scoped child containers (via {@link createChildContainer}).
 * - Automatic disposal for child containers (via {@link dispose}).
 *
 * @example
 * ```ts
 * // Get the global container
 * const globalContainer = ServiceContainer.getInstance().container;
 *
 * // Register a dependency
 * globalContainer.register("MyService", { useClass: MyService });
 *
 * // Create a child container for scoped services
 * const child = ServiceContainer.createChildContainer();
 * const childContainer = child.container;
 *
 * // Dispose of the child container when done
 * child.dispose();
 * ```
 */
export class ServiceContainer {
    private static _instance: ServiceContainer | null = null;
    private readonly _container: DependencyContainer;

    public get container(): DependencyContainer {
        return this._container;
    }

    private constructor(container: DependencyContainer) {
        this._container = container;
    }

    /**
     * Retrieves the global singleton `ServiceContainer` instance.
     *
     * If no instance exists yet, a new one will be created.
     *
     * @returns The global `ServiceContainer` instance.
     */
    public static getInstance(): ServiceContainer {
        if (!this._instance) this._instance = new ServiceContainer(container);
        return this._instance;
    }

    /**
     * Creates a new child service container derived from the global one.
     *
     * Child containers inherit registrations from the global container,
     * but can override or register their own scoped services independently.
     *
     * @returns A new {@link ServiceContainer} instance representing a child container.
     */
    public static createChildContainer(): ServiceContainer {
        const services = this.getInstance();
        return new ServiceContainer(services._container.createChildContainer());
    }
}
