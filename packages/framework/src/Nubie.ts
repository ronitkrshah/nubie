import * as http from "node:http";
import express, { Request, Response, NextFunction } from "express";
import { Config } from "./core/config";
import { GlobalContainer } from "@nubie/di";
import { BaseClassDecorator } from "./abstractions";
import { HttpApp } from "./HttpApp";
import { CompiledFiles, ClassResolver } from "./core/runtime";

type TGlobalErrorHandlerCallback = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export class Nubie {
    private readonly _httpServer: http.Server;
    private readonly _expressApp: express.Express;
    private _globalErrorHandler?: TGlobalErrorHandlerCallback = undefined;

    private constructor() {
        this._expressApp = express();
        this._httpServer = http.createServer(this._expressApp);
        GlobalContainer.addSingleton(Config.Token, Config);
        GlobalContainer.addValue(HttpApp.Token, new HttpApp(this._httpServer, this._expressApp));
    }

    public static createApplication() {
        return new Nubie();
    }

    public async registerClassDecoratorsAsync() {
        for (const decorator of BaseClassDecorator.RegisteredClasses) {
            await decorator.init();
        }
    }

    public useGlobalErrorHandler(errorHandler: TGlobalErrorHandlerCallback) {
        this._globalErrorHandler = errorHandler;
        return this;
    }

    private async mapControllersAsync() {
        const config = GlobalContainer.resolveInstance<Config>(Config.Token).getSection("mappings");
        const files = await CompiledFiles.scanFilesAsync("Controller", config.controllersDirectory);
        for (const file of files) {
            const resolvedClass = new ClassResolver(file);
            resolvedClass.loadClass();
        }
    }

    public async runAsync() {
        const configInstance = GlobalContainer.resolveInstance<Config>(Config.Token);
        await configInstance.loadConfigAsync();

        const appConfig = configInstance.getConfig();
        await this.mapControllersAsync();
        await this.registerClassDecoratorsAsync();
        if (this._globalErrorHandler) this._expressApp.use(this._globalErrorHandler);

        this._httpServer.listen(appConfig.http.port, () => {
            console.log("Server running on port " + appConfig.http.port);
        });
    }
}
