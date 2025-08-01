import { NextFunction, RequestHandler, Request, Response, Router } from "express";
import chalk from "chalk";
import { ControllerBase, TClassMetadata, ClassDecorator } from "../../abstracts";
import AppContext from "../../AppContext";
import { AppConfiguration } from "../../config";
import { DiContainer, TMethodResponse } from "../../core";
import { Logger, NubieError } from "../../helpers";
import { TClass } from "../../types";

class ApiControllerDecorator extends ControllerBase {
    private _endpoint?: string;
    private _router: Router;

    public constructor(endpoint?: string) {
        super();
        this._endpoint = endpoint;
        this._router = Router();
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
        const metadata = ClassDecorator.getMetadata(ControllerBase.METADATA_KEY, this._target);
        const instance = this.getClassInstance(this._target, metadata.constructorInjections);

        Logger.title(`${this._target.name} Routes`);

        /** Registering methods */
        for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
            const apiVersion = methodMetadata.apiVersion || metadata.apiVersion || appConfig.defaultApiVersion;
            const fullpath = `/api/v${apiVersion}/${this._endpoint}/${methodMetadata.endpoint}`.replace(/\/+/g, "/");

            const handlers: RequestHandler[] = [];

            // Add Middlewares
            methodMetadata.middlewares?.forEach((middleware) => {
                handlers.push(middleware);
            });

            async function handleApiRequest(req: Request, res: Response, next: NextFunction) {
                try {
                    for (const method of AppContext.getExtensionMethods(methodName)) {
                        await method.executeAsync(req, res, next);
                    }

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
                    `${chalk.gray(`➜ ${this._target.name}.${methodName}()`)}`,
            );
        }
    }

    public async registerControllerAsync(): Promise<void> {
        const isValidControllerName = this._target.name.endsWith("Controller");
        if (!this._endpoint) {
            this._endpoint = this._target.name.replace("Controller", "").toLowerCase();
        }
        if (!isValidControllerName) {
            return Logger.error(`Ignoring ${this._target.name}. Because It Doesn't Match Nubie Naming Convention`);
        }

        await this.configureControllerAsync();
        AppContext.ExpressApp.use(this._router);
    }
}

const ApiController = ControllerBase.createDecorator(ApiControllerDecorator);

export default ApiController;
