import { Exception } from "../../../utils";

export class UnauthenticatedRequestException extends Exception {
    public constructor() {
        super("You're not authorized to access this resource");
    }
}
