import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class AuthorizationHeaderRequiredException extends Exception {
    public constructor() {
        super(
            "Authentication failed. A valid access token is required to access this resource.",
            HttpStatusCodes.Unauthorized,
        );
    }
}
