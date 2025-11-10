import { THttpContext } from "../types";
import { BaseClassDecorator } from "../../../abstractions";
import { IRestMetadata } from "../IRestMetadata";
import { ObjectEditor } from "../../../utils";

export abstract class RestClassExtension {
    abstract handleAsync(context: THttpContext): Promise<void>;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, RestClassExtension>,
    ) {
        return function (...args: TArgs) {
            return function (target: object) {
                const metadata: IRestMetadata =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target) || {};

                const extendedInstance = new ExtendedClass(...args);
                const editor = new ObjectEditor(metadata);
                editor.mutateState((state) => {
                    if (!state.classMiddlewares) state.classMiddlewares = [];
                    state.classMiddlewares.push(extendedInstance);
                });

                Reflect.defineMetadata(BaseClassDecorator.MetadataKey, editor.getState(), target);
            };
        };
    }
}
