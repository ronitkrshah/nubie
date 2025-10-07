import { EventMetadataKey } from "../EventRegistry";
import { ObjectEditor } from "../../utils";
import { IEventMetadata } from "../IEventMetadata";

export function EventListener(event: string) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        const metadata: IEventMetadata[] =
            Reflect.getOwnMetadata(EventMetadataKey, target.constructor) || [];
        const editor = new ObjectEditor(metadata);

        editor.mutateState((state) => {
            state.push({ eventName: event, methodName: propertyKey });
        });

        Reflect.defineMetadata(EventMetadataKey, editor.getState(), target.constructor);
    };
}
