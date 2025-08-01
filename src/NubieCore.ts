import { AppConfiguration } from "./config";
import * as FileSystem from "node:fs/promises";
import { Logger, NubieError } from "./helpers";
import AppContext from "./AppContext";
import { ClassDecorator, TClassMetadata } from "./decorators";
import { NextFunction, Router, Request, Response, RequestHandler } from "express";
import chalk from "chalk";
import { TClass } from "./types";
import { DiContainer, TMethodResponse } from "./core";

class NubieCore {
    private readonly _router = Router();

    private async loadControllersAsync() {
        const config = await AppConfiguration.getAppConfigAsync();
        const controllerDirectory = `${AppConfiguration.projectPath}/${config.buildDir}/${config.controllersDirectory}`;
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
            arguements[injectionData.paramIndex] = DiContainer.resolve(injectionData.token);
        }

        return new Class(...arguements);
    }

    private async configureControllerAsync() {
        const appConfig = await AppConfiguration.getAppConfigAsync();

        for (const decorator of AppContext.classDecorators) {
            const metadata = ClassDecorator.getMetadata(decorator);
            const instance = this.getClassInstance(decorator, metadata.constructorInjections);

            Logger.title(`${metadata.className} Routes`);

            /** registering methods */
            for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
                const apiVersion = methodMetadata.apiVersion || metadata.apiVersion || appConfig.defaultApiVersion;
                const fullpath = `/api/v${apiVersion}/${metadata.endpoint}/${methodMetadata.endpoint}`.replace(
                    /\/+/g,
                    "/",
                );

                const handlers: RequestHandler[] = [];

                // Add Middlewares
                methodMetadata.middlewares?.forEach((middleware) => {
                    handlers.push(middleware);
                });

                /** Express Route Handler */
                async function handleApiRequest(req: Request, res: Response, next: NextFunction) {
                    // Executing extension methods
                    try {
                        for (const method of AppContext.getExtensionMethods(methodName)) {
                            await method.executeAsync(req, res, next);
                        }

                        // Executing extension params
                        const arguements: unknown[] = [];
                        for (const param of AppContext.getExtensionParams(methodName)) {
                            arguements[param.paramIndex] = await param.executeAsync(req, res, next);
                        }

                        const data: TMethodResponse<any> = await instance[methodName](...arguements);
                        if (data) {
                            return res.status(data.statusCode).json(data.data);
                        }
                    } catch (error) {
                        if (error instanceof NubieError) {
                            res.status(error.statusCode).json({
                                message: error.message,
                                explaination: error.explaination,
                            });
                        } else {
                            throw error;
                        }
                    }
                }

                handlers.push(handleApiRequest);

                this._router[methodMetadata.httpMethod](fullpath, ...handlers);
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

export default new NubieCore();
