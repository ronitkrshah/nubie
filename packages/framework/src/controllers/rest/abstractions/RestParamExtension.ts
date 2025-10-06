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
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target.constructor) ||
                    {};

                const extendedInstance = new ExtendedClass(...args);
                const editor = new ObjectEditor(metadata);

                editor.mutateState((state) => {
                    // @ts-ignore
                    (state.requestHandlers ??= {})[propertyKey] ??= {};
                    // @ts-ignore
                    state.requestHandlers[propertyKey].params ??= [];
                    // @ts-ignore
                    state.requestHandlers[propertyKey].params.push({
                        decorator: extendedInstance,
                        index,
                    });
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
