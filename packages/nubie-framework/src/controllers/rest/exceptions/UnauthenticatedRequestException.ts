import { HttpException } from "../../../exceptions";

export class UnauthenticatedRequestException extends HttpException {
    public constructor() {
        super("Unauthorized Access", 403, "You're not authorized to access this resource");
    }
}
