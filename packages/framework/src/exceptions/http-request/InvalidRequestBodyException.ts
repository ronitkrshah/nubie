import { HttpStatusCodes } from "../../http";
import Exception from "../Exception";

export default class InvalidRequestBodyException extends Exception {
    public constructor() {
        super(
            "The server was unable to process the request because it is malformed or missing required information.",
            HttpStatusCodes.BadRequest,
        );
    }
}
