import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class AuthorizationHeaderRequiredException extends Exception {
    public constructor() {
        super(
            "Authentication failed. A valid access token is required to access this resource.",
            HttpStatusCodes.Unauthorized,
        );
    }
}
