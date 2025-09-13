import express, { Express, NextFunction, Request, Response } from "express";
import { AppConfig } from "./config";
import AppState from "./AppState";
import { Logger, NubieError } from "./utils";
import * as FileSystem from "node:fs/promises";
import { detect } from "detect-port";
import figlet from "figlet";
import { TConstructor } from "./types";
import { DiContainer } from "./core";

type TErrorHandlerFunc = (err: Error, req: Request, res: Response, next: NextFunction) => void;
export type TDiService = [TConstructor, string, "Singleton" | "Transient"];

export default class Nubie {
    private _expressApp: Express;
    private _errorHanler?: TErrorHandlerFunc;
    private _useDefaultErrorMessage = true;
    private _diServicesPaths: string[] = [];

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
        this._expressApp.use(express.json());
        this._expressApp.use(express.urlencoded({ extended: false }));
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
     * @param useDefaultErrorResponse Whether to apply the default error response format. Defaults to `true`.
     */
    public setErrorHandler(
        errorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void,
        useDefaultErrorResponse = true,
    ) {
        this._useDefaultErrorMessage = useDefaultErrorResponse;
        this._errorHanler = errorHandler;
        return this;
    }

    /**
     * Dynamically loads controller modules from the configured directory.
     *
     * Skips loading if the directory doesn't exist.
     */
    private async loadControllersDynamically() {
        const config = await AppConfig.getConfig();
        const controllerDirectory = `${AppConfig.projectPath}/build/${config.controllersDirectory}`;
        let isDirExists = false;
        try {
            await FileSystem.stat(controllerDirectory);
            isDirExists = true;
        } catch {}

        if (!isDirExists) return;

        /** Importing Controllers */
        const files = await FileSystem.readdir(controllerDirectory, { recursive: true });
        for (const file of files) {
            if (file.endsWith("Controller.js")) {
                await import(`${controllerDirectory}/${file}`);
            }
        }
    }

    /**
     * Auto load DI Files from the givn directories
     * File name must be one of these `Injection.ts` or `DI.ts`
     */
    public addDiServices(directories: string[]) {
        this._diServicesPaths = directories;
        return this;
    }

    private async initializeDiServicesAsync() {
        const fileNames = ["Injection.js", "DI.js"];

        for (const dir of this._diServicesPaths) {
            for (const file of fileNames) {
                const fullPath = `${AppConfig.projectPath}/build/${dir}/${file}`;
                try {
                    await FileSystem.stat(fullPath);
                    const module = await import(fullPath);
                    const services = module?.services as TDiService[] | undefined;
                    services?.forEach((service) => {
                        if (service[2] === "Singleton") {
                            DiContainer.addSingleton(service[1], service[0]);
                        } else if (service[2] === "Transient") {
                            DiContainer.addTransient(service[1], service[0]);
                        } else {
                            Logger.log("Invalid Lifecycle Type For " + service[1]);
                        }
                    });
                } catch {}
            }
        }
    }

    /**
     * Applies the configured error handler to the Express app.
     *
     * Should be called after registering controllers to ensure error middleware is registered.
     */
    private initializeErrorHandler() {
        this._expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err);
            if (err instanceof NubieError && this._useDefaultErrorMessage) {
                return res.status(err.statusCode).json({
                    message: err.message,
                    explaination: err.explaination,
                    timestamp: new Date().toISOString(),
                    path: req.originalUrl,
                    method: req.method,
                });
            }

            if (this._errorHanler) {
                return this._errorHanler(err, req, res, next);
            }

            if (this._useDefaultErrorMessage) {
                return res.status(500).json({
                    message: "Internal Server Error",
                    timestamp: new Date().toISOString(),
                    path: req.originalUrl,
                    method: req.method,
                });
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
     * Boots up the application asynchronously.
     *
     * Initializes core components, middleware, and controllers.
     * Should be called once during startup.
     */
    public async runAsync() {
        console.clear();
        const nubie = await figlet.text("Nubie");
        console.log(nubie);
        console.log();
        Logger.log("Application Boot Sequence Initialized...");

        Logger.log("Reading Configuration File (if exists)...");
        const config = await AppConfig.getConfig();

        if (this._diServicesPaths.length > 0) {
            Logger.log("Injecting Dependencies...");
            await this.initializeDiServicesAsync();
        }

        Logger.log("Registering Controllers...");
        await this.loadControllersDynamically();
        for (const controller of AppState.controllers) {
            await controller.registerControllerAsync();
        }

        Logger.log(`Initializing ${this._errorHanler ? "Custom" : "Default"} Error Handler...`);
        this.initializeErrorHandler();

        Logger.log("Checking Port...");
        const isPortAvailable = await this.isPortAvailableAsync(config.port);
        if (!isPortAvailable) {
            Logger.log(`PORT ${config.port} Is Busy. Aborting Execution...`);
            process.exit(1);
        }

        Logger.log("Starting Application...");
        this._expressApp.listen(config.port, () => {
            Logger.log(`Connected to Web API at: http://localhost:${config.port}`);
            Logger.log("Application Started");
        });
    }
}
