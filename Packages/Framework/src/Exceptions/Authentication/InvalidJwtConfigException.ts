import { HttpStatusCodes } from "../../Http";
import Exception from "../Exception";

export default class InvalidJwtConfigException extends Exception {
    public constructor() {
        super("JWT secret is not defined in the application settings", HttpStatusCodes.InternalServerError);
    }
}
