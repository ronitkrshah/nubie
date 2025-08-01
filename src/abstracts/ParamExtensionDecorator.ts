import { NextFunction, Request, Response } from "express";
import AppContext from "../AppContext";

export default abstract class ParamExtensionDecorator {
    private _paramIndex!: number;

    public get paramIndex() {
        return this._paramIndex;
    }

    private setContext(paramIndex: number) {
        this._paramIndex = paramIndex;
    }

    abstract executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown>;

    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => ParamExtensionDecorator) {
        return function (...params: T) {
            return function (target: {}, methodName: string, paramIndex: number) {
                const decoratorInstance = new MethodDecorator(...params);
                decoratorInstance.setContext(paramIndex);
                AppContext.registerParamExtension(methodName, decoratorInstance);
            };
        };
    }
}
