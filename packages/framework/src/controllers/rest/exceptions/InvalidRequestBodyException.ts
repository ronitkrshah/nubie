import { HttpException } from "../../../utils";

export class InvalidRequestBodyException extends HttpException {
    public constructor() {
        super(
            "Invalid Request Body",
            400,
            "The server was unable to process the request because it is malformed or missing required information.",
        );
    }
}
