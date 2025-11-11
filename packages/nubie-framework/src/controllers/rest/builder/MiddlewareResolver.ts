import { IRestMetadata } from "../IRestMetadata";
import { NextFunction, Request, RequestHandler, Response } from "express";

export class MiddlewareResolver {
    private readonly _metadata: IRestMetadata;

    public constructor(metadata: IRestMetadata) {
        this._metadata = metadata;
    }

    public getNativeMiddlewares(methodName: string) {
        return (
            this._metadata?.requestHandlers?.[methodName]?.nativeMiddlewares?.slice().reverse() ??
            []
        );
    }

    public getClassMiddlewares() {
        const middlewares = this._metadata.classMiddlewares?.slice().reverse() || [];

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
            this._metadata.requestHandlers?.[methodName]?.methodMiddlewares?.slice().reverse() ||
            [];

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
