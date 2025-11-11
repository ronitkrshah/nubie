import { ObjectEditor } from "../utils";
import { AppContext } from "../AppContext";
import { Injectable, Transient } from "../core/dependency-injection/decorators";

type TClassDecoratorMetadata = {
    markedAsInjectable?: boolean;
};

export abstract class BaseClassDecorator {
    public static MetadataKey = Symbol("nubie:internal:classDecorator");

    public target!: TClass;

    abstract build(): Promise<void> | void;

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, BaseClassDecorator>,
    ) {
        return function (...args: TArgs) {
            return function (target: TClass) {
                const metadata: TClassDecoratorMetadata =
                    Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, target) || {};

                if (!metadata.markedAsInjectable) {
                    const editor = new ObjectEditor(metadata);
                    editor.mutateState((state) => {
                        state.markedAsInjectable = true;
                    });

                    // Setup for injecting dependencies
                    Injectable()(target);
                    Transient(target.name)(target);

                    Reflect.defineMetadata(
                        BaseClassDecorator.MetadataKey,
                        editor.getState(),
                        target,
                    );
                }

                const extendedClass = new ExtendedClass(...args);
                extendedClass.target = target;
                AppContext.getInstance().classDecorators.push(extendedClass);
            };
        };
    }
}
