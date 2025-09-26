import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class MissingParameterException extends Exception {
    public constructor(parameter: string) {
        super(
            `Parameter ${parameter} is required but was not provided.`,
            HttpStatusCodes.BadRequest,
        );
    }
}
