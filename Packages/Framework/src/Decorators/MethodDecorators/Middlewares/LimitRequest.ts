import { MethodDecorator } from "../../../Abstractions";
import { RateLimit } from "../../../Http";
import { RateLimitReachedException } from "../../../Exceptions/HttpRequest";
import { Logger } from "../../../Utilities";
import rateLimit from "express-rate-limit";

class LimitRequestDecorator extends MethodDecorator {
    public constructor(public readonly rateLimitKey: string) {
        super();
        if (!RateLimit.rateLimits.has(rateLimitKey)) {
            Logger.log("Invalid Rate Limit Key Found! " + rateLimitKey);
            process.exit(1);
        }
    }

    public async executeAsync(): Promise<void> {
        const metadata = this.getMethodMetadata();
        const middlewares = metadata[this._methodName]?.middlewares || [];

        const rateLimitOptions = RateLimit.rateLimits.get(this.rateLimitKey)!;

        const requestHandler = rateLimit({
            windowMs: rateLimitOptions.timeFrameInMinutes * 60 * 1000,
            limit: rateLimitOptions.requestLimit,
            standardHeaders: true,
            handler: () => {
                throw new RateLimitReachedException();
            },
        });

        this.updateMethodMetadata({
            middlewares: [...middlewares, requestHandler],
        });
    }
}

/**
 * Applies rate limit to endpoint
 */
const LimitRequest = MethodDecorator.createDecorator(LimitRequestDecorator);

export default LimitRequest;
