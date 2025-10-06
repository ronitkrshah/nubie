export type TRateLimitConf = {
    timeFrameInMinutes: number;
    requestLimit: number;
};

export const rateLimitRegistryMap = new Map<string, TRateLimitConf>();

export const RateLimitRegistry = {
    addNewConf(key: string, conf: TRateLimitConf) {
        rateLimitRegistryMap.set(key, conf);
    },
};
