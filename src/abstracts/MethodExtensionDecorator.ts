import { NextFunction, Request, Response } from "express";
import AppContext from "../AppContext";

export default abstract class MethodExtensionDecorator {
    abstract executeAsync(req: Request, res: Response, next: NextFunction): Promise<void>;

    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => MethodExtensionDecorator) {
        return function (...params: T) {
            return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
                const decoratorInstance = new MethodDecorator(...params);
                AppContext.registerMethodExtension(methodName, decoratorInstance);
            };
        };
    }
}
