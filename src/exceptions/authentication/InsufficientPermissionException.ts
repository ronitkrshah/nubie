import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class InsufficientPermissionException extends Exception {
    constructor() {
        super("You do not have sufficient permissions to perform this action.", HttpStatusCodes.Forbidden);
    }
}
