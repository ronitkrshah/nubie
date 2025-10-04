import { BaseClassDecorator } from "../../../abstractions";
import { IRestConfig } from "../IRestConfig";
import { ObjectEditor } from "../../../utils";

class ApiVersionDecorator extends BaseClassDecorator {
    public constructor(public readonly version: number) {
        super();
    }

    public init(): Promise<void> | void {
        const metadata: IRestConfig =
            Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, this.target) || {};

        const editor = new ObjectEditor(metadata);
        editor.mutateState((state) => {
            state.apiVersion = this.version;
        });
        Reflect.defineMetadata(BaseClassDecorator.MetadataKey, editor.getState(), this.target);
    }
}

export const ApiVersion = BaseClassDecorator.createDecorator(ApiVersionDecorator);
