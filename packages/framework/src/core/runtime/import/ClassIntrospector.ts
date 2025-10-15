import { isImplementedInterface } from "../../../generic/decorators";

export class ClassIntrospector {
    private readonly _target: TClass;

    public constructor(target: TClass) {
        this._target = target;
    }

    public doesImplement(value: string): boolean {
        return isImplementedInterface(this._target, value);
    }

    public inheritsFrom(BaseClass: TClass): boolean {
        let current = this._target;

        while (current && current !== Object) {
            if (current === BaseClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }

        return false;
    }
}
