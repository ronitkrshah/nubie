import { BaseClassDecorator } from "../../../abstractions";
import { NextFunction, Request, Response, Router } from "express";
import { IRestMetadata } from "../IRestMetadata";
import { THttpMethodResponse, createDiScopeMiddleware } from "../utils";

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

        let endpoint = `/${config.baseEndpoint}/${methodMetadata?.route}`;
        return endpoint.replace(/\/+/g, "/");
    }

    public async buildAsync() {
        const classMetadata: IRestMetadata = Reflect.getOwnMetadata(
            BaseClassDecorator.MetadataKey,
            this.decoratedClass.target,
        );

        classMetadata.middlewares?.forEach((middleware) => {
            this.router.use(middleware);
        });

        const requestHandlersArray = Object.entries(classMetadata.requestHandlers || {});

        for (const [methodName, metadata] of requestHandlersArray) {
            /** For Type Safety */
            if (!metadata) continue;
            const endpoint = this.generateEndpoint(classMetadata, methodName);
            const methodMiddlewares = metadata.middlewares?.slice().reverse() ?? [];

            // Actual Request Handler
            const httpRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
                // It will create new controller instance on every request
                const instance: TController = req.serviceContainer.resolve(
                    this.decoratedClass.target.name,
                );

                try {
                    /** Handler Params */
                    const argument: unknown[] = [];

                    for (const param of metadata.params || []) {
                        argument[param.index] = await param.decorator.handleAsync({ req, res });
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

            this.router[metadata.httpMethod](endpoint, [...methodMiddlewares, httpRequestHandler]);
        }
    }
}
