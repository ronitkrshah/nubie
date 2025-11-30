import express, { Request, Response, NextFunction } from "express";
import { Assembly, ClassResolver } from "./core/runtime";
import { AppContext } from "./AppContext";
import { Configuration } from "./core/config";
import helmet from "helmet";
import { createServer } from "node:http";
import cors from "cors";

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

    private applyGlobalMiddlewares() {
        this.ExpressApp.use(helmet());
        this.ExpressApp.use(express.json());
        this.ExpressApp.use(express.urlencoded({ extended: true }));
        this.ExpressApp.use(cors({ origin: Configuration.options.allowedHosts }));
    }

    private resolveAllControllers() {
        const files = Assembly.scanFiles("Controller", Configuration.options.controllersDirectory);
        files.forEach((file) => ClassResolver.resolve(file));
    }

    public run() {
        this.applyGlobalMiddlewares();

        this.resolveAllControllers();

        // Register all controllers
        this._appContext.classDecorators.forEach((classDecorator) => classDecorator.build());

        // Use global error handler
        if (this._globalErrorHandler) this.ExpressApp.use(this._globalErrorHandler);

        const server = createServer(this.ExpressApp);
        server.listen(Configuration.options.port, () => {
            console.log("Server running on port " + Configuration.options.port);
        });
    }
}
