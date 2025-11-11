import { Request, Response, NextFunction } from "express";
import { Assembly, ClassResolver } from "./core/runtime";
import { AppContext } from "./AppContext";
import { INubieConfig } from "./core/config";

type TGlobalErrorHandlerCallback = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export class Nubie {
    private readonly _appContext: AppContext;
    private readonly _config: INubieConfig;
    private _globalErrorHandler?: TGlobalErrorHandlerCallback = undefined;

    private constructor() {
        this._appContext = AppContext.getInstance();
        this._config = this._appContext.config.getConfig();
    }

    public static createApp() {
        return new Nubie();
    }

    public async registerClassDecoratorsAsync() {
        for (const decorator of this._appContext.classDecorators) {
            await decorator.build();
        }
    }

    public useGlobalErrorHandler(errorHandler: TGlobalErrorHandlerCallback) {
        this._globalErrorHandler = errorHandler;
        return this;
    }

    private async mapControllersAsync() {
        const files = await Assembly.scanFilesAsync(
            "Controller",
            this._config.mappings.controllersDirectory,
        );
        for (const file of files) {
            ClassResolver.resolve(file);
        }
    }

    public async runAsync() {
        const { express, config } = this._appContext;
        await this.mapControllersAsync();
        await this.registerClassDecoratorsAsync();
        if (this._globalErrorHandler) express.use(this._globalErrorHandler);

        express.listen(this._config.http.port, () => {
            console.log("Server running on port " + this._config.http.port);
        });
    }
}
