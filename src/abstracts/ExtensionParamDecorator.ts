import { NextFunction, Request, Response } from "express";
import AppContext from "../AppContext";

export default abstract class ExtensionParamDecorator {
    private _paramIndex!: number;

    public get paramIndex() {
        return this._paramIndex;
    }

    private setContext(paramIndex: number) {
        this._paramIndex = paramIndex;
    }

    abstract executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown>;

    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => ExtensionParamDecorator) {
        return function (...params: T) {
            return function (target: {}, methodName: string, paramIndex: number) {
                const decoratorInstance = new MethodDecorator(...params);
                decoratorInstance.setContext(paramIndex);
                AppContext.addExtensionParamsDecorator(methodName, decoratorInstance);
            };
        };
    }
}
