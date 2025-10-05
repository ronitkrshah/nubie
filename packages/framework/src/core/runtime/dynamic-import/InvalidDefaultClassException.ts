import { Exception } from "../../../utils";

export class InvalidDefaultClassException extends Exception {
    public constructor() {
        super("Invalid Default Class");
    }
}
