import AppContext from "../AppContext";
import { TClass } from "../types";
import ClassDecorator from "./ClassDecorator";

export default abstract class ControllerBase extends ClassDecorator {
    public static readonly METADATA_KEY = Symbol("api:controller");

    public abstract registerControllerAsync(): Promise<void>;

    public static createDecorator<T extends any[]>(Controller: new (...args: T) => ControllerBase) {
        return function (...params: T) {
            return function (target: TClass) {
                const decoratorInstance = new Controller(...params);
                decoratorInstance.setTarget(target);
                AppContext.ApiControllers.push(decoratorInstance);
            };
        };
    }
}
