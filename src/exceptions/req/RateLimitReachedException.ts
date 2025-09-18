import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class RateLimitReachedException extends Exception {
    public constructor() {
        super("Maximum Request Limit Reached. Please Try After Some Time.", HttpStatusCodes.TooManyRequests);
    }
}
