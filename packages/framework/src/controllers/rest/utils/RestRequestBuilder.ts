import { BaseClassDecorator } from "../../../abstractions";
import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { DIContainer } from "@nubie/di";
import { IRestConfig } from "../IRestConfig";
import { Config } from "../../../core/config";
import { THttpMethodResponse } from "./HttpResponse";
import { createDiScopeMiddleware } from "../middlewares-decorators/class/createDiScopeMiddleware";

type TController = Record<string, () => Promise<object | undefined | THttpMethodResponse>>;

export class RestRequestBuilder {
    public readonly router: Router;

    public constructor(public readonly decoratedClass: BaseClassDecorator) {
        this.router = Router();
        this.router.use(createDiScopeMiddleware);
    }

    private generateEndpoint(config: IRestConfig, methodName: string) {
        const methodMetadata = config.requestHandlers![methodName];
        const appConfig = DIContainer.resolveInstance<Config>(Config.Token).getConfig();

        const apiVersion =
            methodMetadata?.apiVersion || config.apiVersion || appConfig.http.defaultApiVersion;

        return `/api/v${apiVersion}/${config.baseEndpoint}/${methodMetadata?.route}`.replace(
            /\/+/g,
            "/",
        );
    }

    private getMethodMiddlewares(config: IRestConfig, methodName: string) {
        const middlewares = config.requestHandlers?.[methodName]?.methodMiddlewares || [];

        const requestHandlers: RequestHandler[] = [];

        middlewares.forEach((middleware) => {
            const handler = async (req: Request, res: Response, next: NextFunction) => {
                await middleware.handleAsync({ req, res, next });
            };

            requestHandlers.push(handler);
        });

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
        const middlewares = this.getClassMiddlewares(restConfig);
        middlewares.forEach((reqHandler) => this.router.use(reqHandler));

        const requestHandlersArray = Object.entries(restConfig.requestHandlers || {});

        for (const [methodName, metadata] of requestHandlersArray) {
            // Just for ts yelling. It will not be undefined
            if (!metadata) continue;
            const endpoint = this.generateEndpoint(restConfig, methodName);
            const middlewares = this.getMethodMiddlewares(restConfig, methodName);
            const httpRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
                // It will create new controller instance on every request
                const instance: TController = req.diContainer.resolveInstance(
                    this.decoratedClass.target.name,
                );

                const result = await instance[methodName].apply(instance);
                if (!result) return res.sendStatus(204);

                if ("statusCode" in result && "data" in result) {
                    const { statusCode, data } = result as THttpMethodResponse;
                    return res.status(statusCode).json(data);
                }

                return res.json(result);
            };

            this.router[metadata.httpMethod](endpoint, [...middlewares, httpRequestHandler]);
        }
    }
}
