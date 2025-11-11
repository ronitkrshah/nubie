export const InterfaceKey = Symbol.for("InterfaceKey");

type TInterfaceImplementation = {
    implements: string;
};

export function Implements(value: string) {
    return function (target: TClass) {
        Reflect.defineMetadata(InterfaceKey, { implements: value }, target);
    };
}

export function isImplements(target: TClass, value: string) {
    const metadata =
        (Reflect.getOwnMetadata(InterfaceKey, target) as TInterfaceImplementation) || {};

    return metadata.implements === value;
}
