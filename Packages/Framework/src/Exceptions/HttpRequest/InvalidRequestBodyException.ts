import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class InvalidRequestBodyException extends Exception {
    public constructor() {
        super(
            "The server was unable to process the request because it is malformed or missing required information.",
            HttpStatusCodes.BadRequest,
        );
    }
}
