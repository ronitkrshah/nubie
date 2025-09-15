import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";

export default class MissingParameterException extends Exception {
    public constructor(parameter: string) {
        super(`Parameter ${parameter} is required but was not provided.`, HttpStatusCodes.BadRequest);
    }
}
