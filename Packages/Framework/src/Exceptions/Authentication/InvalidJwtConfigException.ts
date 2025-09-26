import { HttpStatusCodes } from "../../Core";
import { Exception } from "../../Utilities";

export default class InvalidJwtConfigException extends Exception {
    public constructor() {
        super(
            "JWT secret is not defined in the application settings",
            HttpStatusCodes.InternalServerError,
        );
    }
}
