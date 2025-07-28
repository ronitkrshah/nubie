import { NubieAppConfig } from "../config";
import * as FileSystem from "node:fs/promises";
import { Logger } from "../helpers";
import AppContext from "../AppContext";
import { NubieClassDecorator, TClassMetadata } from "../decorators";
import { NextFunction, Router, Request, Response } from "express";
import chalk from "chalk";
import { TClass } from "../types";
import { NubieContainer } from "../core";

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
            }
        }
    }

    private getClassInstance(Class: TClass, constructorInjection: TClassMetadata["constructorInjections"]) {
        const arguements: unknown[] = [];
        for (const injectionData of constructorInjection || []) {
            arguements[injectionData.paramIndex] = NubieContainer.resolve(injectionData.token);
        }

        return new Class(...arguements);
    }

    private async configureControllerAsync() {
        const appConfig = await NubieAppConfig.getAppConfigAsync();

        for (const decorator of AppContext.classDecorators) {
            const metadata = NubieClassDecorator.getMetadata(decorator);
            const instance = this.getClassInstance(decorator, metadata.constructorInjections);

            Logger.title(`${metadata.className} Routes`);

            /** registering methods */
            for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
                const apiVersion = methodMetadata.apiVersion || metadata.apiVersion || appConfig.defaultApiVersion;
                const fullpath = `/api/v${apiVersion}/${metadata.endpoint}/${methodMetadata.endpoint}`.replace(
                    /\/+/g,
                    "/",
                );

                /** Express Route Handler */
                async function handleApiRequest(req: Request, res: Response, next: NextFunction) {
                    // Executing extension methods
                    for (const method of AppContext.getExtensionMethods(methodName)) {
                        await method.executeAsync(req, res, next);
                    }

                    // Executing extension params
                    const arguements: unknown[] = [];
                    for (const param of AppContext.getExtensionParams(methodName)) {
                        arguements[param.paramIndex] = await param.executeAsync(req, res, next);
                    }

                    const data = await instance[methodName](...arguements);
                    return res.json(data);
                }

                this._router[methodMetadata.httpMethod](fullpath, handleApiRequest);
                console.log(
                    `${chalk.green("✔️")}  ${chalk.yellow(`${methodMetadata.httpMethod.toUpperCase()}`)} ` +
                        `${chalk.cyan(fullpath)} ` +
                        `${chalk.gray(`➜ ${metadata.className}.${methodName}()`)}`,
                );
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
