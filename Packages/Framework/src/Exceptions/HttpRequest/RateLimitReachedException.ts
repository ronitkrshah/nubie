import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class RateLimitReachedException extends Exception {
    public constructor() {
        super(
            "Maximum Request Limit Reached. Please Try After Some Time.",
            HttpStatusCodes.TooManyRequests,
        );
    }
}
