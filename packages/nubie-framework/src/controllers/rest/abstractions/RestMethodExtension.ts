import { THttpContext } from "../types";
import { BaseClassDecorator } from "../../../abstractions";
import { IRestMetadata } from "../IRestMetadata";
import { ObjectEditor } from "../../../utils";

export abstract class RestMethodExtension {
    abstract handleAsync(context: THttpContext): Promise<void>;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, RestMethodExtension>,
    ) {
        return function (...args: TArgs) {
            return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
                const metadata: IRestMetadata =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target.constructor) ||
                    {};

                const extendedInstance = new ExtendedClass(...args);
                const editor = new ObjectEditor(metadata);
                editor.mutateState((state) => {
                    if (!state.requestHandlers) state.requestHandlers = {};
                    const metadata = state.requestHandlers[propertyKey];
                    if (metadata) {
                        if (!metadata.methodMiddlewares) metadata.methodMiddlewares = [];
                        metadata.methodMiddlewares.push(extendedInstance);
                    } else {
                        // @ts-ignore
                        state.requestHandlers[propertyKey] = {
                            methodMiddlewares: [extendedInstance],
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
