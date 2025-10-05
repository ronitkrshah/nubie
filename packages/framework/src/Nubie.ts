import * as http from "node:http";
import express from "express";
import { Config } from "./core/config";
import { DIContainer } from "@nubie/di";
import { BaseClassDecorator } from "./abstractions";
import { HttpApp } from "./HttpApp";
import { CompiledFiles, DynamicImport } from "./core/runtime";

export class Nubie {
    private readonly _httpServer: http.Server;
    private readonly _expressApp: express.Express;

    private constructor() {
        this._expressApp = express();
        this._httpServer = http.createServer(this._expressApp);
        DIContainer.addSingleton(Config.Token, Config);
        DIContainer.addValue(HttpApp.Token, new HttpApp(this._httpServer, this._expressApp));
    }

    public static createApplication() {
        return new Nubie();
    }

    public async registerClassDecoratorsAsync() {
        for (const decorator of BaseClassDecorator.RegisteredClasses) {
            await decorator.init();
        }
    }

    private async mapControllersAsync() {
        const config = DIContainer.resolveInstance<Config>(Config.Token).getSection("mappings");
        const files = await CompiledFiles.scanFilesAsync("Controller", config.controllersDirectory);
        for (const file of files) {
            const dynamicImport = new DynamicImport(file);
            await dynamicImport.importClassAsync();
        }
    }

    public async runAsync() {
        const configInstance = DIContainer.resolveInstance<Config>(Config.Token);
        await configInstance.loadConfigAsync();

        const appConfig = configInstance.getConfig();
        await this.mapControllersAsync();
        await this.registerClassDecoratorsAsync();

        this._httpServer.listen(appConfig.http.port, () => {
            console.log("Server running on port " + appConfig.http.port);
        });
    }
}
