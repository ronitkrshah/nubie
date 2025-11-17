import { BaseClassDecorator } from "../../../abstractions";
import { NextFunction, Request, Response, Router } from "express";
import { IRestMetadata } from "../IRestMetadata";
import { IConfiguration } from "../../../core/config";
import { THttpMethodResponse, createDiScopeMiddleware } from "../utils";
import { MiddlewareResolver } from "./MiddlewareResolver";
import { AppContext } from "../../../AppContext";

type TController = Record<
    string,
    (...args: unknown[]) => Promise<object | undefined | THttpMethodResponse>
>;

export class RestRequestBuilder {
    public readonly router: Router;
    private readonly _config: IConfiguration;

    public constructor(public readonly decoratedClass: BaseClassDecorator) {
        this.router = Router();
        this.router.use(createDiScopeMiddleware);
        this._config = AppContext.getInstance().config.getConfig();
    }

    private generateEndpoint(config: IRestMetadata, methodName: string) {
        const methodMetadata = config.requestHandlers![methodName];

        let endpoint = `/${config.baseEndpoint}/${methodMetadata?.route}`;

        if (this._config.http.useApiVersioning) {
            const apiVersion =
                methodMetadata?.apiVersion ||
                config.apiVersion ||
                this._config.http.defaultApiVersion;
            endpoint = `/v${apiVersion}` + endpoint;
        }
        return endpoint.replace(/\/+/g, "/");
    }

    public async buildAsync() {
        const classMetadata: IRestMetadata = Reflect.getOwnMetadata(
            BaseClassDecorator.MetadataKey,
            this.decoratedClass.target,
        );

        const middlewareResolver = new MiddlewareResolver(classMetadata);

        // Class Level Middlewares
        const controllerLevelMiddlewares = middlewareResolver.getClassMiddlewares();
        controllerLevelMiddlewares.forEach((reqHandler) => this.router.use(reqHandler));

        const requestHandlersArray = Object.entries(classMetadata.requestHandlers || {});

        for (const [methodName, metadata] of requestHandlersArray) {
            /** For Type Safety */
            if (!metadata) continue;
            const endpoint = this.generateEndpoint(classMetadata, methodName);

            /** Framework Level Middlewares */
            const methodLevelMiddlewares = middlewareResolver.getMethodMiddlewares(methodName);
            /** Native Middlewares */
            const nativeHttpMiddlewares = middlewareResolver.getNativeMiddlewares(methodName);

            // Actual Request Handler
            const httpRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
                // It will create new controller instance on every request
                const instance: TController = req.serviceContainer.resolve(
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
                ...nativeHttpMiddlewares,
                ...methodLevelMiddlewares,
                httpRequestHandler,
            ]);
        }
    }
}
