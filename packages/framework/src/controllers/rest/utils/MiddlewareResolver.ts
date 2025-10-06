import { IRestConfig } from "../IRestConfig";
import { NextFunction, Request, RequestHandler, Response } from "express";

export class MiddlewareResolver {
    private readonly _config: IRestConfig;

    public constructor(config: IRestConfig) {
        this._config = config;
    }

    public getNativeMiddlewares(methodName: string) {
        return (
            this._config?.requestHandlers?.[methodName]?.nativeMiddlewares?.slice().reverse() ?? []
        );
    }

    public getClassMiddlewares() {
        const middlewares = this._config.classMiddlewares?.slice().reverse() || [];

        const requestHandlers: RequestHandler[] = [];

        middlewares.forEach((middleware) => {
            const handler = async (req: Request, res: Response, next: NextFunction) => {
                await middleware.handleAsync({ req, res, next });
            };

            requestHandlers.push(handler);
        });

        return requestHandlers;
    }

    public getMethodMiddlewares(methodName: string) {
        const middlewares =
            this._config.requestHandlers?.[methodName]?.methodMiddlewares?.slice().reverse() || [];

        const requestHandlers: RequestHandler[] = [];

        middlewares.forEach((middleware) => {
            const handler = async (req: Request, res: Response, next: NextFunction) => {
                await middleware.handleAsync({ req, res, next });
            };
            requestHandlers.push(handler);
        });

        return requestHandlers;
    }
}
