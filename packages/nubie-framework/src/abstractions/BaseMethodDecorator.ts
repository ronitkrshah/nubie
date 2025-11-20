import { BaseClassDecorator } from "./BaseClassDecorator";

export abstract class BaseMethodDecorator<TClassMetadata extends object> {
    protected target!: object;
    protected propertyKey!: string;
    protected descriptor!: PropertyDescriptor;

    abstract build(): void;

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
                const decorator = new ExtendedClass(...args);
                decorator.target = target;
                decorator.propertyKey = propertyKey;
                decorator.descriptor = descriptor;

                /**
                 * The reason we're invoking build method-extensions here because subclasses will mutate
                 * the constructor metadata
                 */
                decorator.build();
            };
        };
    }
}
