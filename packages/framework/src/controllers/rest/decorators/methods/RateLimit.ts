import { BaseMethodDecorator } from "../../../../abstractions";
import { IRestMetadata } from "../../IRestMetadata";
import { rateLimitRegistryMap } from "../../registry";
import { InvalidRateLimitRegistryKeyException, RateLimitReachedException } from "../../exceptions";
import rateLimit from "express-rate-limit";
import { ObjectEditor } from "../../../../utils";

class RateLimitDecorator extends BaseMethodDecorator<IRestMetadata> {
    public constructor(public readonly rateLimitKey: string) {
        super();
        if (!rateLimitRegistryMap.has(rateLimitKey))
            throw new InvalidRateLimitRegistryKeyException(rateLimitKey);
    }

    public async init(): Promise<void> {
        const metadata = this.getClassMetadata();
        const rateLimitOptions = rateLimitRegistryMap.get(this.rateLimitKey)!;

        const requestHandler = rateLimit({
            windowMs: rateLimitOptions.timeFrameInMinutes * 60 * 1000,
            limit: rateLimitOptions.requestLimit,
            standardHeaders: true,
            handler: () => {
                throw new RateLimitReachedException();
            },
        });

        const editor = new ObjectEditor(metadata);
        editor.mutateState((state) => {
            // @ts-ignore
            (state.requestHandlers ??= {})[this.propertyKey] ??= {};
            // @ts-ignore
            state.requestHandlers[this.propertyKey].nativeMiddlewares ??= [];
            // @ts-ignore
            state.requestHandlers[this.propertyKey].nativeMiddlewares.push(requestHandler);
        });

        this.updateClassMetadata(editor.getState());
    }
}

export const RateLimit = BaseMethodDecorator.createDecorator(RateLimitDecorator);
