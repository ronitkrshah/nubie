import express, { Express, NextFunction, Request, Response } from "express";
import { AppConfig } from "./config";
import AppState from "./AppState";
import { Logger, NubieError } from "./utils";
import * as FileSystem from "node:fs/promises";

type TErrorHandlerFunc = (err: Error, req: Request, res: Response, next: NextFunction) => void;

export default class Nubie {
    private _expressApp: Express;
    private _errorHanler?: TErrorHandlerFunc;
    private _useDefaultErrorMessage = true;

    public get ExpressApp() {
        return this._expressApp;
    }

    private constructor() {
        this._expressApp = express();
        this._expressApp.use(express.json());
        this._expressApp.use(express.urlencoded({ extended: false }));
        AppState.expressApp = this._expressApp;
    }

    public static createApp(): Nubie {
        return new Nubie();
    }

    public setErrorHandler(
        errorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void,
        useDefaultErrorResponse = true,
    ) {
        this._useDefaultErrorMessage = useDefaultErrorResponse;
        this._errorHanler = errorHandler;
        return this;
    }

    private async loadControllersAsync() {
        const config = await AppConfig.getConfig();
        const controllerDirectory = `${AppConfig.projectPath}/build/${config.controllersDirectory}`;
        let isDirExists = false;
        try {
            await FileSystem.stat(controllerDirectory);
            isDirExists = true;
        } catch (error) {
            // ... ignore
        }

        if (!isDirExists) return;

        /** Importing Controllers */
        const files = await FileSystem.readdir(controllerDirectory, { recursive: true });
        for (const file of files) {
            if (file.endsWith("Controller.js")) {
                await import(`${controllerDirectory}/${file}`);
            }
        }
    }

    private useErrorHandler() {
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

    public async runAsync() {
        console.clear();
        Logger.log("Application Boot Sequence Initialized...");
        Logger.log("Registering Controllers...");
        await this.loadControllersAsync();
        for (const controller of AppState.controllers) {
            await controller.registerControllerAsync();
        }
        this.useErrorHandler();
        const config = await AppConfig.getConfig();

        this._expressApp.listen(config.port, () => {
            Logger.log(`Connected to Web API at: http://localhost:${config.port}`);
        });
    }
}
