import { ControllerBase, MethodExtensionDecorator, ParamExtensionDecorator } from "./abstracts";
import { Express } from "express";

class AppContext {
    public ExpressApp!: Express;
    public readonly ApiControllers: ControllerBase[] = [];

    private _extensionMethods = new Map<string, MethodExtensionDecorator[]>();
    private _extensionParams = new Map<string, ParamExtensionDecorator[]>();

    public getExtensionsForMethod(methodName: string) {
        const savedValue = this._extensionMethods.get(methodName);
        return savedValue || [];
    }

    public getExtensionsForMethodParams(methodName: string) {
        const savedValue = this._extensionParams.get(methodName);
        return savedValue || [];
    }

    public registerMethodExtension(methodName: string, decorator: MethodExtensionDecorator) {
        const savedValue = this._extensionMethods.get(methodName);
        this._extensionMethods.set(methodName, [...(savedValue || []), decorator]);
    }

    public registerParamExtension(methodName: string, decorator: ParamExtensionDecorator) {
        const savedValue = this._extensionParams.get(methodName);
        this._extensionParams.set(methodName, [...(savedValue || []), decorator]);
    }
}

export default new AppContext();
