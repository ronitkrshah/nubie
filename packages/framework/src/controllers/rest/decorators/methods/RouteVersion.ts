import { BaseMethodDecorator } from "../../../../abstractions";
import { IRestMetadata } from "../../IRestMetadata";
import { ObjectEditor } from "../../../../utils";

class RouteVersionDecorator extends BaseMethodDecorator<IRestMetadata> {
    public constructor(public readonly version: number) {
        super();
    }

    public init(): Promise<void> | void {
        const metadata = this.getClassMetadata();
        const editor = new ObjectEditor(metadata);
        editor.mutateState((state) => {
            // @ts-ignore
            (state.requestHandlers ??= {})[this.propertyKey] ??= {};
            // @ts-ignore
            state.requestHandlers[this.propertyKey].apiVersion = this.version;
        });
        this.updateClassMetadata(editor.getState());
    }
}

export const RouteVersion = BaseMethodDecorator.createDecorator(RouteVersionDecorator);
