export type TEventHandlerCallback = (payload: object) => Promise<void>;

export const EventMetadataKey = Symbol("event:registry");

class EventRegistry {
    private readonly _registry: Map<string, TEventHandlerCallback[]> = new Map();

    public registerEvent(event: string, handler: TEventHandlerCallback): void {
        if (!this._registry.has(event)) {
            this._registry.set(event, [handler]);
            return;
        }

        const events = this._registry.get(event)!;
        events.push(handler);
    }

    public async raiseEventAsync(event: string, payload: object) {
        const handlers = this._registry.get(event) || [];
        await Promise.all(handlers.map((handler) => handler(payload)));
    }
}

export default new EventRegistry();
