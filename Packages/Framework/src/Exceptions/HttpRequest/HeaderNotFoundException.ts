import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class HeaderNotFoundException extends Exception {
    public constructor(header: string) {
        super(
            `Header ${header} was expected but not provided in the request.`,
            HttpStatusCodes.BadRequest,
        );
    }
}
