import { THttpContext } from "../types";
import { BaseClassDecorator } from "../../../abstractions";
import { IRestMetadata } from "../IRestMetadata";
import { ObjectEditor } from "../../../utils";
import { NextFunction, Request, RequestHandler, Response } from "express";

export abstract class RestClassExtension {
    abstract invokeAsync(context: THttpContext): Promise<void>;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, RestClassExtension>,
    ) {
        return function (...args: TArgs) {
            return function (target: object) {
                const metadata: IRestMetadata =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target) || {};

                const extendedInstance = new ExtendedClass(...args);
                const handler: RequestHandler = async (
                    req: Request,
                    res: Response,
                    next: NextFunction,
                ) => {
                    await extendedInstance.invokeAsync({ req, res, next });
                };

                const editor = new ObjectEditor(metadata);
                editor.mutateState((state) => {
                    if (!state.middlewares) state.middlewares = [];
                    state.middlewares.push(handler);
                });

                Reflect.defineMetadata(BaseClassDecorator.MetadataKey, editor.getState(), target);
            };
        };
    }
}
