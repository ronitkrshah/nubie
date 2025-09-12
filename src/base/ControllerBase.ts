import AppState from "../AppState";
import { TConstructor } from "../types";

export default abstract class ControllerBase {
    public static readonly METADATA_KEY = Symbol("api:controller");
    public _target!: TConstructor;

    public abstract registerControllerAsync(): Promise<void>;

    public static createDecorator<T extends any[]>(apiControllerClass: new (...args: T) => ControllerBase) {
        return function (...params: T) {
            return function (target: TConstructor) {
                const controllerInstance = new apiControllerClass(...params);
                controllerInstance._target = target;
                AppState.controllers.push(controllerInstance);
            };
        };
    }
}
