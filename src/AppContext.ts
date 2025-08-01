import { ControllerBase, ExtensionMethodDecorator, ExtensionParamDecorator } from "./decorators";
import { Express } from "express";

class AppContext {
    public ExpressApp!: Express;
    public readonly ApiControllers: ControllerBase[] = [];
    private _extensionMethods = new Map<string, ExtensionMethodDecorator[]>();
    private _extensionParams = new Map<string, ExtensionParamDecorator[]>();

    public getExtensionMethods(methodName: string) {
        const savedValue = this._extensionMethods.get(methodName);
        return savedValue || [];
    }

    public getExtensionParams(methodName: string) {
        const savedValue = this._extensionParams.get(methodName);
        return savedValue || [];
    }

    public addExtensionMethodDecorator(methodName: string, decorator: ExtensionMethodDecorator) {
        const savedValue = this._extensionMethods.get(methodName);
        this._extensionMethods.set(methodName, [...(savedValue || []), decorator]);
    }

    public addExtensionParamsDecorator(methodName: string, decorator: ExtensionParamDecorator) {
        const savedValue = this._extensionParams.get(methodName);
        this._extensionParams.set(methodName, [...(savedValue || []), decorator]);
    }
}

export default new AppContext();
