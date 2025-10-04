import { BaseMethodDecorator } from "../../../abstractions";
import { IRestConfig } from "../IRestConfig";
import { ObjectEditor } from "../../../utils";

class RouteVersionDecorator extends BaseMethodDecorator<IRestConfig> {
    public constructor(public readonly version: number) {
        super();
    }

    public init(): Promise<void> | void {
        const metadata = this.getClassMetadata();
        const editor = new ObjectEditor(metadata);
        editor.mutateState((state) => {
            if (!state.requestHandlers) state.requestHandlers = {};
            const metadata = state.requestHandlers[this.propertyKey];
            if (metadata) {
                metadata.apiVersion = this.version;
            } else {
                // @ts-ignore
                state.requestHandlers[this.propertyKey] = {
                    apiVersion: this.version,
                };
            }
        });
        this.updateClassMetadata(editor.getState());
    }
}

export const RouteVersion = BaseMethodDecorator.createDecorator(RouteVersionDecorator);
