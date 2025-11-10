import EventRegistry, { EventMetadataKey, TEventHandlerCallback } from "../EventRegistry";
import { IEventMetadata } from "../IEventMetadata";

export function EventSubscriber() {
    return function (target: TClass<any, any>) {
        const metadata: IEventMetadata[] = Reflect.getOwnMetadata(EventMetadataKey, target) || [];
        const instance: Record<string, TEventHandlerCallback> = new target();

        /**
         * Method decorators are called first that's why we will get
         * all the handler in constructor decorator
         */
        metadata.forEach((entry) => {
            const handler = instance[entry.methodName].bind(instance);
            EventRegistry.registerEvent(entry.eventName, handler);
        });
    };
}
