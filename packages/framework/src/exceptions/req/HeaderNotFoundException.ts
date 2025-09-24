import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class HeaderNotFoundException extends Exception {
    public constructor(header: string) {
        super(
            `Header ${header} was expected but not provided in the request.`,
            HttpStatusCodes.BadRequest,
        );
    }
}
