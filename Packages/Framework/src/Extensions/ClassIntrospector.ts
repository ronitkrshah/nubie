export default class ClassIntrospector {
    public readonly classConstructor: Class;
    public readonly className: string;

    public constructor(target: Class) {
        this.classConstructor = target;
        this.className = target.name;
    }

    public isSubclassOf(baseClass: AbstractClass | Class): boolean {
        let proto: object = Object.getPrototypeOf(this.classConstructor);
        while (proto && proto !== Function.prototype) {
            if (proto === baseClass) {
                return true;
            }
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    }
}
