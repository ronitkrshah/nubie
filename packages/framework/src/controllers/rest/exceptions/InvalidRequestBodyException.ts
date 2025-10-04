import { Exception } from "../../../utils";

export class InvalidRequestBodyException extends Exception {
    public constructor() {
        super(
            "The server was unable to process the request because it is malformed or missing required information.",
        );
    }
}
