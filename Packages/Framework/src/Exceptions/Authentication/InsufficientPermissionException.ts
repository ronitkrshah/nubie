import { HttpStatusCodes } from "../../Http";
import Exception from "../Exception";

export default class InsufficientPermissionException extends Exception {
    constructor() {
        super("You do not have sufficient permissions to perform this action.", HttpStatusCodes.Forbidden);
    }
}
