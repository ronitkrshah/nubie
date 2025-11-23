import { THttpContext } from "../types";
import { BaseClassDecorator } from "../../../abstractions";
import { IRestMetadata } from "../IRestMetadata";
import { ObjectEditor } from "../../../utils";
import { Request, Response, NextFunction, RequestHandler } from "express";

export abstract class RestMethodExtension {
    abstract invokeAsync(context: THttpContext): Promise<void>;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, RestMethodExtension>,
    ) {
        return function (...args: TArgs) {
            return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
                const metadata: IRestMetadata =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target.constructor) ||
                    {};

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
                    if (!state.requestHandlers) state.requestHandlers = {};
                    const metadata = state.requestHandlers[propertyKey];
                    if (metadata) {
                        if (!metadata.middlewares) metadata.middlewares = [];
                        metadata.middlewares.push(handler);
                    } else {
                        // @ts-ignore
                        state.requestHandlers[propertyKey] = {
                            middlewares: [handler],
                        };
                    }
                });

                Reflect.defineMetadata(
                    BaseClassDecorator.MetadataKey,
                    editor.getState(),
                    target.constructor,
                );
            };
        };
    }
}
