import { HttpException } from "../../../utils";

export class MissingRequiredQueryException extends HttpException {
    public constructor(queryKey: string) {
        super("Missing Query", 400, "Missing Required Query Key: " + queryKey);
    }
}
