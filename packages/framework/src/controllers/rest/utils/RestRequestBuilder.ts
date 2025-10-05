import { BaseClassDecorator } from "../../../abstractions";
import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { DIContainer } from "@nubie/di";
import { IRestConfig } from "../IRestConfig";
import { Config } from "../../../core/config";
import { THttpMethodResponse } from "./HttpResponse";
import { createDiScopeMiddleware } from "../decorators/extensions/class/createDiScopeMiddleware";

type TController = Record<
    string,
    (...args: unknown[]) => Promise<object | undefined | THttpMethodResponse>
>;

export class RestRequestBuilder {
    public readonly router: Router;

    public constructor(public readonly decoratedClass: BaseClassDecorator) {
        this.router = Router();
        this.router.use(createDiScopeMiddleware);
    }

    private generateEndpoint(config: IRestConfig, methodName: string) {
        const methodMetadata = config.requestHandlers![methodName];
        const appConfig = DIContainer.resolveInstance<Config>(Config.Token).getConfig();

        let endpoint = `/${config.baseEndpoint}/${methodMetadata?.route}`;

        if (appConfig.http.useApiVersioning) {
            const apiVersion =
                methodMetadata?.apiVersion || config.apiVersion || appConfig.http.defaultApiVersion;
            endpoint = `/v${apiVersion}` + endpoint;
        }
        return endpoint.replace(/\/+/g, "/");
    }

    private getMethodMiddlewares(config: IRestConfig, methodName: string) {
        const middlewares = config.requestHandlers?.[methodName]?.methodMiddlewares || [];

        const requestHandlers: RequestHandler[] = [];

        for (let i = middlewares.length - 1; i >= 0; i--) {
            const handler = async (req: Request, res: Response, next: NextFunction) => {
                await middlewares[i].handleAsync({ req, res, next });
            };

            requestHandlers.push(handler);
        }

        return requestHandlers;
    }

    private getClassMiddlewares(config: IRestConfig) {
        const middlewares = config.classMiddlewares || [];

        const requestHandlers: RequestHandler[] = [];

        middlewares.forEach((middleware) => {
            const handler = async (req: Request, res: Response, next: NextFunction) => {
                await middleware.handleAsync({ req, res, next });
            };

            requestHandlers.push(handler);
        });

        return requestHandlers;
    }

    public async buildAsync() {
        const restConfig: IRestConfig = Reflect.getOwnMetadata(
            BaseClassDecorator.MetadataKey,
            this.decoratedClass.target,
        );

        // Class Level Middlewares
        const classMiddlewares = this.getClassMiddlewares(restConfig);
        classMiddlewares.forEach((reqHandler) => this.router.use(reqHandler));

        const requestHandlersArray = Object.entries(restConfig.requestHandlers || {});

        for (const [methodName, metadata] of requestHandlersArray) {
            /** For Type Safety */
            if (!metadata) continue;
            const endpoint = this.generateEndpoint(restConfig, methodName);

            /** Method Level Middlewares */
            const methodMiddlewares = this.getMethodMiddlewares(restConfig, methodName);

            // Actual Request Handler
            const httpRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
                // It will create new controller instance on every request
                const instance: TController = req.diContainer.resolveInstance(
                    this.decoratedClass.target.name,
                );

                try {
                    /** Handler Params */
                    const argument: unknown[] = [];
                    for (const param of metadata.params || []) {
                        argument[param.index] = await param.decorator.handleAsync({
                            req,
                            res,
                            next,
                        });
                    }

                    const result = await instance[methodName].apply(instance, argument);
                    if (!result) return res.sendStatus(204);

                    if ("statusCode" in result && "data" in result) {
                        const { statusCode, data } = result as THttpMethodResponse;
                        return res.status(statusCode).json(data);
                    }

                    return res.json(result);
                } catch (error) {
                    next(error);
                }
            };

            this.router[metadata.httpMethod](endpoint, [...methodMiddlewares, httpRequestHandler]);
        }
    }
}
