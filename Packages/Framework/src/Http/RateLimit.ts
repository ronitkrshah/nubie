export type TRateLimitConf = {
    timeFrameInMinutes: number;
    requestLimit: number;
};

export default class RateLimit {
    public static rateLimits = new Map<string, TRateLimitConf>();

    public constructor(key: string, options: TRateLimitConf) {
        RateLimit.rateLimits.set(key, options);
    }
}
