import { Exception } from "../../../utils";

export class InvalidControllerNameException extends Exception {
    public constructor() {
        super("Controller Name Must End With Controller Suffix");
    }
}
