import { ObjectEditor } from "../utils";
import { DIContainer } from "@nubie/di";

type TClassDecoratorMetadata = {
    markedAsInjectable?: boolean;
};

export abstract class BaseClassDecorator {
    public static MetadataKey = Symbol("nubie:internal:classDecorator");
    public static RegisteredClasses: BaseClassDecorator[] = [];

    public target!: TClass;

    abstract init(): Promise<void> | void;

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
                    DIContainer.markAsInjectable(target);
                    DIContainer.addTransient(target.name, target);
                    Reflect.defineMetadata(
                        BaseClassDecorator.MetadataKey,
                        editor.getState(),
                        target,
                    );
                }

                const extendedClass = new ExtendedClass(...args);
                extendedClass.target = target;
                BaseClassDecorator.RegisteredClasses.push(extendedClass);
            };
        };
    }
}
