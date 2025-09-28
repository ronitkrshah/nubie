import { HttpStatusCodes } from "../../http";
import Exception from "../Exception";

export default class RateLimitReachedException extends Exception {
    public constructor() {
        super("Maximum Request Limit Reached. Please Try After Some Time.", HttpStatusCodes.TooManyRequests);
    }
}
