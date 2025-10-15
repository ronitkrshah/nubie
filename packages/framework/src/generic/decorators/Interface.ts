export const InterfaceKey = Symbol("InterfaceKey");

export function Interface(value: string) {
    return function (target: TClass) {
        Reflect.defineMetadata(InterfaceKey, { implementedInterface: value }, target);
    };
}

export function isImplementedInterface(target: TClass, value: string) {
    const metadata = Reflect.getOwnMetadata(InterfaceKey, target);
    if (!metadata) return false;
    return !!(metadata?.implementedInterface && metadata?.implementedInterface === value);
}
