import NubieClassDecorator, { TClassMetadata } from "./NubieClassDecorator";

export type TMethodMetadata = {
    endpoint: string;
    apiVersion?: number;
    httpMethod: "get" | "post" | "put" | "patch" | "delete";
    body?: Record<string, string>;
};

export default abstract class NubieMethodDecorator {
    public static readonly METADATA_KEY = Symbol("api:method");

    protected _target!: Object;
    protected _methodName!: string;
    protected _descriptor!: PropertyDescriptor;

    abstract executeAsync(): Promise<void>;

    private setContext(target: Object, methodName: string, descriptor: PropertyDescriptor) {
        this._target = target;
        this._methodName = methodName;
        this._descriptor = descriptor;
    }

    protected getMethodMetadata() {
        const existingMetadata: Record<string, TMethodMetadata> =
            Reflect.getMetadata(NubieMethodDecorator.METADATA_KEY, this._target) || {};
        return existingMetadata || {};
    }

    protected updateMethodMetadata(metadata: Partial<TMethodMetadata>) {
        const existingMetadata = this.getMethodMetadata();
        Reflect.defineMetadata(
            NubieMethodDecorator.METADATA_KEY,
            {
                ...existingMetadata,
                [this._methodName]: {
                    ...(existingMetadata[this._methodName] || {}),
                    ...metadata,
                },
            },
            this._target,
        );
    }

    private addMethodToController() {
        const existingMetadata: TClassMetadata = Reflect.getMetadata(
            NubieClassDecorator.METADATA_KEY,
            this._target.constructor,
        );

        const methodMetadata = this.getMethodMetadata();

        Reflect.defineMetadata(
            NubieClassDecorator.METADATA_KEY,
            {
                ...existingMetadata,
                methods: {
                    ...(existingMetadata.methods || {}),
                    [this._methodName]: {
                        ...(existingMetadata.methods?.[this._methodName] || {}),
                        ...methodMetadata[this._methodName],
                    },
                },
            },
            this._target.constructor,
        );
    }

    public static updateMethodMetadata(target: Object, methodName: string, metadata: Partial<TMethodMetadata>) {
        const existingMetadata: Record<string, TMethodMetadata> =
            Reflect.getMetadata(NubieMethodDecorator.METADATA_KEY, target) || {};
        Reflect.defineMetadata(
            NubieMethodDecorator.METADATA_KEY,
            {
                ...existingMetadata,
                [methodName]: {
                    ...(existingMetadata[methodName] || {}),
                    ...metadata,
                },
            },
            target,
        );
    }

    public static createDecorator<T extends any[]>(MethodDecorator: new (...args: T) => NubieMethodDecorator) {
        return function (...params: T) {
            return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
                const decoratorInstance = new MethodDecorator(...params);
                decoratorInstance.setContext(target, methodName, descriptor);
                decoratorInstance.executeAsync().then(() => {
                    decoratorInstance.addMethodToController();
                });
            };
        };
    }
}
