import { THttpContext } from "../types";
import { BaseClassDecorator } from "../../../abstractions";
import { IRestConfig } from "../IRestConfig";
import { ObjectEditor } from "../../../utils";

export abstract class RestParamExtension {
    abstract handleAsync(context: Omit<THttpContext, "next">): Promise<unknown>;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, RestParamExtension>,
    ) {
        return function (...args: TArgs) {
            return function (target: object, propertyKey: string, index: number) {
                const metadata: IRestConfig =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target) || {};

                const extendedInstance = new ExtendedClass(...args);
                const editor = new ObjectEditor(metadata);

                editor.mutateState((state) => {
                    if (!state.requestHandlers) state.requestHandlers = {};
                    const metadata = state.requestHandlers[propertyKey];
                    if (metadata) {
                        if (!metadata.params) metadata.params = [];
                        metadata.params.push({ decorator: extendedInstance, index });
                    } else {
                        // @ts-ignore
                        state.requestHandlers[propertyKey] = {
                            params: [{ decorator: extendedInstance, index }],
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
