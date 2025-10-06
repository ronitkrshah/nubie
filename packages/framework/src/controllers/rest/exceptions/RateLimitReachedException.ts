import { Exception } from "../../../utils";

export class RateLimitReachedException extends Exception {
    public constructor() {
        super("Maximum Request Limit Reached. Please Try After Some Time.");
    }
}
