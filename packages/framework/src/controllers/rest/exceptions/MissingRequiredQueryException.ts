import { Exception } from "../../../utils";

export class MissingRequiredQueryException extends Exception {
    public constructor(queryKey: string) {
        super("Missing Required Query Key: " + queryKey);
    }
}
