import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class UnauthorizedAccessException extends Exception {
    constructor() {
        super("The provided credentials are invalid or expired.", HttpStatusCodes.Unauthorized);
    }
}
