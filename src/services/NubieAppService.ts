import { NubieAppConfig } from "../config";
import * as FileSystem from "node:fs/promises";
import { Logger } from "../helpers";
import AppContext from "../AppContext";
import { NubieClassDecorator } from "../decorators";
import { NextFunction, Router, Request, Response } from "express";

class NubieAppService {
    private readonly _router = Router();

    private async loadControllersAsync() {
        const config = await NubieAppConfig.getAppConfigAsync();
        const controllerDirectory = `${NubieAppConfig.projectPath}/${config.buildDir}/${config.controllersDirectory}`;
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
                Logger.success(`Loaded: ${file.split("/").pop()?.replace(".js", "")}`);
            }
        }
    }

    private async configureControllerAsync() {
        const appConfig = await NubieAppConfig.getAppConfigAsync();

        for (const decorator of AppContext.classDecorators) {
            const metadata = NubieClassDecorator.getMetadata(decorator);
            const instance = new decorator();

            /** registering methods */
            for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
                const apiVersion = methodMetadata.apiVersion || metadata.apiVersion || appConfig.defaultApiVersion;
                const fullpath = `/api/v${apiVersion}/${metadata.endpoint}/${methodMetadata.endpoint}`.replace(
                    /\/+/g,
                    "/",
                );

                /** Express Route Handler */
                async function handleApiRequest(req: Request, res: Response, next: NextFunction) {
                    const data = await instance[methodName]();
                    return res.json(data || { ping: "pong" });
                }

                this._router[methodMetadata.httpMethod](fullpath, handleApiRequest);
                Logger.success(`[${methodMetadata.httpMethod.toUpperCase()}] :: ${fullpath}`);
            }
        }
    }

    public async setupRouterAsyc(): Promise<Router> {
        await this.loadControllersAsync();
        await this.configureControllerAsync();
        return this._router;
    }
}

export default new NubieAppService();
