import { HttpStatusCodes } from "../../Http";
import Exception from "../Exception";

export default class MissingParameterException extends Exception {
    public constructor(parameter: string) {
        super(`Parameter ${parameter} is required but was not provided.`, HttpStatusCodes.BadRequest);
    }
}
