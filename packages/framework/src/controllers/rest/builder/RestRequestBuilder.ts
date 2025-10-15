import { BaseClassDecorator } from "../../../abstractions";
import { NextFunction, Request, Response, Router } from "express";
import { GlobalContainer } from "@nubie/di";
import { IRestMetadata } from "../IRestMetadata";
import { Config } from "../../../core/config";
import { THttpMethodResponse } from "../utils";
import { createDiScopeMiddleware } from "../decorators/extensions/class/createDiScopeMiddleware";
import { MiddlewareResolver } from "./MiddlewareResolver";

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

    private generateEndpoint(config: IRestMetadata, methodName: string) {
        const methodMetadata = config.requestHandlers![methodName];
        const appConfig = GlobalContainer.resolveInstance<Config>(Config.Token).getConfig();

        let endpoint = `/${config.baseEndpoint}/${methodMetadata?.route}`;

        if (appConfig.http.useApiVersioning) {
            const apiVersion =
                methodMetadata?.apiVersion || config.apiVersion || appConfig.http.defaultApiVersion;
            endpoint = `/v${apiVersion}` + endpoint;
        }
        return endpoint.replace(/\/+/g, "/");
    }

    public async buildAsync() {
        const restConfig: IRestMetadata = Reflect.getOwnMetadata(
            BaseClassDecorator.MetadataKey,
            this.decoratedClass.target,
        );

        const middlewareResolver = new MiddlewareResolver(restConfig);

        // Class Level Middlewares
        const classMiddlewares = middlewareResolver.getClassMiddlewares();
        classMiddlewares.forEach((reqHandler) => this.router.use(reqHandler));

        const requestHandlersArray = Object.entries(restConfig.requestHandlers || {});

        for (const [methodName, metadata] of requestHandlersArray) {
            /** For Type Safety */
            if (!metadata) continue;
            const endpoint = this.generateEndpoint(restConfig, methodName);

            /** Framework Level Middlewares */
            const methodMiddlewares = middlewareResolver.getMethodMiddlewares(methodName);
            /** Native Middlewares */
            const nativeMiddlewares = middlewareResolver.getNativeMiddlewares(methodName);

            // Actual Request Handler
            const httpRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
                // It will create new controller instance on every request
                const instance: TController = req.diContainer.resolveInstance(
                    this.decoratedClass.target.name,
                );

                try {
                    /** Handler Params */
                    const argument: unknown[] = [];

                    for (const param of metadata.params?.slice().reverse() || []) {
                        argument[param.index] = await param.decorator.handleAsync({
                            req,
                            res,
                        });
                    }

                    const result = await instance[methodName].apply(instance, argument);
                    if (res.headersSent) return;
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

            this.router[metadata.httpMethod](endpoint, [
                ...methodMiddlewares,
                ...nativeMiddlewares,
                httpRequestHandler,
            ]);
        }
    }
}
