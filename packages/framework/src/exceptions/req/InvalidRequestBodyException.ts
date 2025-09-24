import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class InvalidRequestBodyException extends Exception {
    public constructor() {
        super(
            "The server was unable to process the request because it is malformed or missing required information.",
            HttpStatusCodes.BadRequest,
        );
    }
}
