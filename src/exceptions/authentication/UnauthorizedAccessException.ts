import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class UnauthorizedAccessException extends Exception {
    constructor() {
        super("The provided credentials are invalid or expired.", HttpStatusCodes.Unauthorized);
    }
}
