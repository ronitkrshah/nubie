import { TConstructor } from "../types";

class Metdata {
    public getMetadata<T>(metadataKey: symbol, constructor: TConstructor, propKey?: keyof T): T | T[keyof T] {
        const metadata: T = Reflect.getOwnMetadata(metadataKey, constructor) || {};
        return propKey ? metadata[propKey] : metadata;
    }

    public updateMetadata<T>(key: symbol, target: TConstructor, metadata: Partial<T>) {
        const existingMetadata = this.getMetadata(key, target) as T;
        Reflect.defineMetadata(key, { ...existingMetadata, ...metadata }, target);
    }

    public updateMetadataSingleValue<T>(key: symbol, target: TConstructor, propKey: keyof T, value: T[keyof T]) {
        const existingMetadata = this.getMetadata(key, target) as T;
        Reflect.defineMetadata(key, { ...existingMetadata, [propKey]: value }, target);
    }
}

export default new Metdata();
