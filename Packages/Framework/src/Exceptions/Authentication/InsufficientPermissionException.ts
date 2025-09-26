import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class InsufficientPermissionException extends Exception {
    constructor() {
        super(
            "You do not have sufficient permissions to perform this action.",
            HttpStatusCodes.Forbidden,
        );
    }
}
