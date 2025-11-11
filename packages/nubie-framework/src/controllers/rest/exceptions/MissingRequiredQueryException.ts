import { HttpException } from "../../../exceptions";

export class MissingRequiredQueryException extends HttpException {
    public constructor(queryKey: string) {
        super("Missing Query", 400, "Missing Required Query Key: " + queryKey);
    }
}
