import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { IConfiguration } from "./Configuration";
import { ApplicationConfig } from "./Configuration";
import AppState from "./AppState";
import { Logger } from "./Utilities";
import { Exception } from "./Exceptions";
import * as FileSystem from "node:fs/promises";
import http from "node:http";
import { detect } from "detect-port";
import { Server } from "socket.io";
import { type IServiceCollection, ServiceCollection } from "./Extensions/ServiceCollection";
import { BuildScanner } from "./Runtime";
import path from "node:path";
import cors from "cors";

type TErrorHandlerCallback = (err: Error, req: Request, res: Response, next: NextFunction) => void;
type TServiceBuilder = new (serviceCollection: IServiceCollection) => object;

export default class Nubie {
    private readonly _expressApp: Express;
    private readonly _httpServer: http.Server;
    private _errorHandler?: TErrorHandlerCallback;
    private _services: TServiceBuilder[] = [];

    /**
     * Gets the underlying Express application instance.
     *
     * Useful for accessing middleware, routes, or server configuration
     * directly from the framework.
     *
     * @returns  The Express app instance.
     */
    public get expressApp() {
        return this._expressApp;
    }

    private constructor() {
        this._expressApp = express();
        this._httpServer = http.createServer(this._expressApp);
        AppState.expressApp = this._expressApp;
    }

    /**
     * Creates and returns a new instance of the Nubie application.
     *
     * This is the primary entry point for initializing the framework.
     * Typically used to bootstrap the app and configure middleware, routes, etc.
     *
     * @returns A new Nubie application instance.
     */
    public static createApp(): Nubie {
        return new Nubie();
    }

    /**
     * Configures a custom error handler for the application.
     *
     * If no handler is provided, the framework will use its default error-handling logic.
     * The `useDefaultErrorResponse` flag controls whether the default error response format
     * is applied when a custom handler is used.
     *
     * @param errorHandler Optional custom error-handling middleware.
     */
    public setErrorHandler(
        errorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void,
    ): Nubie {
        this._errorHandler = errorHandler;
        return this;
    }

    /**
     * Dynamically loads controller modules from the configured directory.
     *
     * Skips loading if the directory doesn't exist.
     */
    private async mapControllersAsync(): Promise<void> {
        const config = ApplicationConfig.config;
        const controllerDirectory = path.join(
            ApplicationConfig.projectPath,
            "build",
            config.Mappings.ControllerDirectory,
        );
        let isDirExists: boolean;

        try {
            const stat = await FileSystem.stat(controllerDirectory);
            if (stat.isDirectory()) {
                isDirExists = true;
            } else {
                isDirExists = false;
            }
        } catch {
            isDirExists = false;
        }

        if (!isDirExists) return;

        // This will import and call the the controller decorator
        const resolvedClasses = await BuildScanner.scanFilesAsync("Controller", {
            parentDir: config.Mappings?.ControllerDirectory,
        });

        for (const exportedClass of resolvedClasses) {
            if (exportedClass.file.name.replace(".js", "") !== exportedClass.introspector.className) {
                Logger.log(
                    `Export mismatch: "${exportedClass.introspector.className}" must be the default export and match the ${exportedClass.file.name}. Ensure the class name and file name are identical.`,
                );
                process.exit(0);
            }
        }
    }

    public addServices(services: TServiceBuilder[]): Nubie {
        this._services = services;
        return this;
    }

    /**
     * Applies the configured error handler to the Express app.
     *
     * Should be called after registering controllers to ensure error middleware is registered.
     */
    private initializeErrorHandler(): Nubie {
        this._expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);

            if (this._errorHandler) {
                return this._errorHandler(err, req, res, next);
            } else if (err instanceof Exception) {
                return res.status(err.statusCode).json(err.toJson());
            }

            next(err);
        });

        return this;
    }

    /**
     * Checks if the configured port is available for use.
     */
    private async isPortAvailableAsync(port: number): Promise<boolean> {
        try {
            const result = await detect(port);
            return result == port;
        } catch {
            return false;
        }
    }

    /**
     * Set Application Properties And Intialize Services
     */
    private async setupApplicationAsync(config: IConfiguration) {
        this._services.forEach((serviceBuilder) => new serviceBuilder(ServiceCollection));
        this._expressApp.use(express.json({ limit: config.HttpRequest.MaxBodySize }));
        AppState.socketIo = new Server(this._httpServer, {
            cors: { origin: config.Hosts?.AllowedHosts },
        });
        if (config.Hosts?.AllowedHosts) {
            this._expressApp.use(cors({ origin: config.Hosts.AllowedHosts }));
        }
        await this.mapControllersAsync();
        for (const controller of AppState.controllers) {
            await controller.registerControllerAsync();
        }
        this.initializeErrorHandler();
    }

    /**
     * Boots up the application asynchronously.
     *
     * Initializes core components, middleware, and controllers.
     * Should be called once during startup.
     */
    public async runAsync(): Promise<void> {
        await ApplicationConfig.loadConfigAsync();
        const config = ApplicationConfig.config;
        await this.setupApplicationAsync(config);

        const isPortAvailable = await this.isPortAvailableAsync(config.Port);
        if (!isPortAvailable) {
            Logger.log(`PORT ${config.Port} Is Busy. Aborting Execution...`);
            process.exit(1);
        }

        this._httpServer.listen(config.Port, () => {
            Logger.log(`Connected to Web API at: http://localhost:${config.Port}`);
            Logger.log("Application Started");
        });
    }
}
