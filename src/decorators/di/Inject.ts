import { DI_METADATA_KEY } from "../../core/DiContainer";
import { TConstructor } from "../../types";

/**
 * Injects a dependency into the controller constructor.
 *
 * @param token The DI token used to resolve the dependency.
 */
export default function Inject(token: string) {
    return function (target: TConstructor, _paramKey: undefined, paramIndex: number) {
        const existingInjections = Reflect.getMetadata(DI_METADATA_KEY, target) || [];
        Reflect.defineMetadata(DI_METADATA_KEY, [...existingInjections, { token, paramIndex }], target);
    };
}
