import { ControllerBase, MethodExtensionDecorator, ParamExtensionDecorator } from "./base";
import { Express } from "express";

class AppState {
    public expressApp!: Express;
    public readonly controllers: ControllerBase[] = [];

    private _extensionMethods = new Map<string, MethodExtensionDecorator[]>();
    private _extensionParams = new Map<string, ParamExtensionDecorator[]>();

    public getMethodExtensions(key: string) {
        const savedValue = this._extensionMethods.get(key);
        return savedValue || [];
    }

    public getParamExtensions(key: string) {
        const savedValue = this._extensionParams.get(key);
        return savedValue || [];
    }

    public registerMethodExtension(key: string, decorator: MethodExtensionDecorator) {
        const savedValue = this._extensionMethods.get(key);
        this._extensionMethods.set(key, [...(savedValue || []), decorator]);
    }

    public registerParamExtension(key: string, decorator: ParamExtensionDecorator) {
        const savedValue = this._extensionParams.get(key);
        this._extensionParams.set(key, [...(savedValue || []), decorator]);
    }
}

export default new AppState();
