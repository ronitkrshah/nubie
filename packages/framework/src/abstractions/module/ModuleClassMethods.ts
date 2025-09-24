import { TConstructor } from "../../types";

type AbstractClass = Function & { prototype: any };

export default class ModuleClassMethods {
    public constructor(private readonly _target: TConstructor) {}

    public isSubclassOf(baseClass: AbstractClass | TConstructor<any>): boolean {
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
