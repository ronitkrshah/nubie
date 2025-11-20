import express, { Request, Response, NextFunction } from "express";
import { Assembly, ClassResolver } from "./core/runtime";
import { AppContext } from "./AppContext";
import { Configuration } from "./core/config";
import helmet from "helmet";

type TGlobalErrorHandlerCallback = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export class NubieApplication {
    private readonly _appContext: AppContext;
    private _globalErrorHandler?: TGlobalErrorHandlerCallback = undefined;

    public get ExpressApp() {
        return this._appContext.express;
    }

    public constructor() {
        this._appContext = AppContext.saveContext(express());

        this.ExpressApp.use(helmet());
        this.ExpressApp.use(express.json());
        this.ExpressApp.use(express.urlencoded({ extended: true }));
    }

    private async registerClassDecoratorsAsync() {
        for (const decorator of this._appContext.classDecorators) {
            await decorator.build();
        }
    }

    public useGlobalErrorHandler(errorHandler: TGlobalErrorHandlerCallback) {
        this._globalErrorHandler = errorHandler;
        return this;
    }

    private mapControllers() {
        const files = Assembly.scanFiles("Controller", Configuration.options.controllersDirectory);
        for (const file of files) {
            ClassResolver.resolve(file);
        }
    }

    public async runAsync() {
        const { express } = this._appContext;
        this.mapControllers();
        await this.registerClassDecoratorsAsync();
        if (this._globalErrorHandler) express.use(this._globalErrorHandler);

        express.listen(Configuration.options.port, () => {
            console.log("Server running on port " + Configuration.options.port);
        });
    }
}
