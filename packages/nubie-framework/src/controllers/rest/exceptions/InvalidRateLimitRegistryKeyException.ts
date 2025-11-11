import { Exception } from "../../../exceptions";

export class InvalidRateLimitRegistryKeyException extends Exception {
    public constructor(key: string) {
        super("Provided Key " + key + " Not Found In RateLimitRegistry");
    }
}
