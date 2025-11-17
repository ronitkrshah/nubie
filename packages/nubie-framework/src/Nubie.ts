import { Express, Request, Response, NextFunction } from "express";
import { Assembly, ClassResolver } from "./core/runtime";
import { AppContext } from "./AppContext";
import { Configuration } from "./core/config";

type TGlobalErrorHandlerCallback = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export class Nubie {
    private readonly _appContext: AppContext;
    private _globalErrorHandler?: TGlobalErrorHandlerCallback = undefined;

    public constructor(app: Express) {
        this._appContext = AppContext.saveContext(app);
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
            Configuration.options.controllersDirectory,
        );
        for (const file of files) {
            ClassResolver.resolve(file);
        }
    }

    public async runAsync() {
        const { express } = this._appContext;
        await this.mapControllersAsync();
        await this.registerClassDecoratorsAsync();
        if (this._globalErrorHandler) express.use(this._globalErrorHandler);

        express.listen(Configuration.options.port, () => {
            console.log("Server running on port " + Configuration.options.port);
        });
    }
}
