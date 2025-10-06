import { HttpException } from "../../../utils";

export class RateLimitReachedException extends HttpException {
    public constructor() {
        super(
            "Too Many Requests",
            429,
            "Maximum Request Limit Reached. Please Try After Some Time.",
        );
    }
}
