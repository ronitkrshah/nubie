import { NubieExtensionMethodDecorator, NubieExtensionParamDecorator } from "./decorators";
import { TClass } from "./types";

class AppContext {
    private _classDecorators = new Map<string, TClass>();
    private _extensionMethods = new Map<string, NubieExtensionMethodDecorator[]>();
    private _extensionParams = new Map<string, NubieExtensionParamDecorator[]>();

    public get classDecorators() {
        return Array.from(this._classDecorators.values());
    }

    public getExtensionMethods(methodName: string) {
        const savedValue = this._extensionMethods.get(methodName);
        return savedValue || [];
    }

    public getExtensionParams(methodName: string) {
        const savedValue = this._extensionParams.get(methodName);
        return savedValue || [];
    }

    public addClassDecorator(decorator: TClass) {
        this._classDecorators.set(decorator.name, decorator);
    }

    public addExtensionMethodDecorator(methodName: string, decorator: NubieExtensionMethodDecorator) {
        const savedValue = this._extensionMethods.get(methodName);
        this._extensionMethods.set(methodName, [...(savedValue || []), decorator]);
    }

    public addExtensionParamsDecorator(methodName: string, decorator: NubieExtensionParamDecorator) {
        const savedValue = this._extensionParams.get(methodName);
        this._extensionParams.set(methodName, [...(savedValue || []), decorator]);
    }
}

export default new AppContext();
