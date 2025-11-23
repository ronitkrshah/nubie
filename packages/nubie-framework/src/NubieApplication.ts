import express, { Request, Response, NextFunction } from "express";
import { Assembly, ClassResolver } from "./core/runtime";
import { AppContext } from "./AppContext";
import { Configuration } from "./core/config";
import helmet from "helmet";
import fs from "node:fs";
import { createServer } from "node:http";

type TGlobalErrorHandlerCallback = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export class NubieApplication {
    private static _isInitialized = false;
    private readonly _appContext: AppContext;
    private _globalErrorHandler?: TGlobalErrorHandlerCallback = undefined;

    public get ExpressApp() {
        return this._appContext.express;
    }

    public constructor() {
        if (NubieApplication._isInitialized)
            throw new Error("Nubie application is already initialized");
        NubieApplication._isInitialized = true;

        this._appContext = AppContext.saveContext(express());

        this.ExpressApp.use(helmet());
        this.ExpressApp.use(express.json());
        this.ExpressApp.use(express.urlencoded({ extended: true }));
    }

    public useGlobalErrorHandler(errorHandler: TGlobalErrorHandlerCallback) {
        this._globalErrorHandler = errorHandler;
        return this;
    }

    private mapControllers() {
        const isDirExists = fs.existsSync(Configuration.options.controllersDirectory);
        if (!isDirExists) return;

        const files = Assembly.scanFiles("Controller", Configuration.options.controllersDirectory);
        files.forEach((file) => ClassResolver.resolve(file));
    }

    public run() {
        const { express } = this._appContext;
        this.mapControllers();
        this._appContext.classDecorators.forEach((classDecorator) => classDecorator.build());
        if (this._globalErrorHandler) express.use(this._globalErrorHandler);

        const server = createServer(this.ExpressApp);
        server.listen(Configuration.options.port, () => {
            console.log("Server running on port " + Configuration.options.port);
        });
    }
}
