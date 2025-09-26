import { HttpStatusCodes } from "../../Http";
import Exception from "../Exception";

export default class UnauthorizedAccessException extends Exception {
    constructor() {
        super("The provided credentials are invalid or expired.", HttpStatusCodes.Unauthorized);
    }
}
