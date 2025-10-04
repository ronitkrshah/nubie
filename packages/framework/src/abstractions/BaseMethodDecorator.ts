import { BaseClassDecorator } from "./BaseClassDecorator";

export abstract class BaseMethodDecorator<TClassMetadata extends object> {
    protected target!: object;
    protected propertyKey!: string;
    protected descriptor!: PropertyDescriptor;

    abstract init(): Promise<void> | void;

    protected getClassMetadata(): TClassMetadata {
        return (
            Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, this.target.constructor) || {}
        );
    }

    protected updateClassMetadata(metadata: TClassMetadata) {
        Reflect.defineMetadata(BaseClassDecorator.MetadataKey, metadata, this.target.constructor);
    }

    public static createDecorator<TArgs extends unknown[]>(
        ExtendedClass: TClass<TArgs, BaseMethodDecorator<object>>,
    ) {
        return function (...args: TArgs) {
            return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
                const decoratorInstance = new ExtendedClass(...args);
                decoratorInstance.target = target;
                decoratorInstance.propertyKey = propertyKey;
                decoratorInstance.descriptor = descriptor;
                decoratorInstance.init();
            };
        };
    }
}
