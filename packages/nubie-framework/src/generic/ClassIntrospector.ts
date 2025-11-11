import { isImplements } from "./decorators";

/**
 * Utility class that provides a simple way to introspect and analyze
 * relationships between classes at runtime.
 *
 * This class is intentionally lightweight and user-friendly —
 * it avoids complex reflection or metadata APIs.
 */
export class ClassIntrospector {
    private readonly _target: TClass;

    public constructor(target: TClass) {
        this._target = target;
    }

    /**
     * Check if this class implements a specific interface.
     *
     * @note
     * Works only if the target class uses the `@Implements()` decorator.
     *
     * @param value - The name of the interface to check.
     * @returns `true` if the class declares that it implements the given interface, otherwise `false`.
     *
     * @example
     * ```ts
     * @Implements("ISerializable")
     * class User {}
     *
     * new ClassIntrospector(User).doesImplement("ISerializable"); // true
     * ```
     */
    public doesImplement(value: string): boolean {
        return isImplements(this._target, value);
    }

    /**
     * Determine whether the target class extends a given base class.
     *
     * Supports deep (multi-level) inheritance detection.
     *
     * @param BaseClass - The base class to test against.
     * @returns `true` if the target class extends (directly or indirectly) the specified base class, otherwise `false`.
     *
     * @example
     * ```ts
     * class Base {}
     * class Sub extends Base {}
     *
     * new ClassIntrospector(Sub).isSubclassOf(Base); // true
     * ```
     */
    public isSubclassOf(BaseClass: TClass): boolean {
        let current = this._target;

        while (current && current !== Object) {
            if (current === BaseClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }

        return false;
    }

    /**
     * Check if this class directly extends the specified base class.
     *
     * This method only checks the immediate parent class — it does **not**
     * traverse the full inheritance chain.
     *
     * @param BaseClass - The class to test against as the direct superclass.
     * @returns `true` if the target class directly extends the given base class, otherwise `false`.
     *
     * @note
     * For multi-level (deep) inheritance checks, use the {@link isSubclassOf} method instead.
     *
     * @example
     * ```ts
     * class A {}
     * class B extends A {}
     * class C extends B {}
     *
     * new ClassIntrospector(B).isDirectSubclassOf(A); // true
     * new ClassIntrospector(C).isDirectSubclassOf(A); // false
     * new ClassIntrospector(C).isSubclassOf(A);       // true
     * ```
     */
    public isDirectSubclassOf(BaseClass: TClass): boolean {
        return Object.getPrototypeOf(this._target) === BaseClass;
    }
}
