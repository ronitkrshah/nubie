import type { TConstructor } from "../../types";

type AbstractClass = abstract new (...args: unknown[]) => unknown;

export default class ModuleClassMethods {
    public constructor(private readonly _target: TConstructor) {}

    public isSubclassOf(baseClass: AbstractClass | TConstructor): boolean {
        let proto = Object.getPrototypeOf(this._target);
        while (proto && proto !== Function.prototype) {
            if (proto === baseClass) {
                return true;
            }
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    }
}
