import { Exception } from "../../../exceptions";

export class InvalidControllerNameException extends Exception {
    public constructor() {
        super("Controller Name Must End With Controller Suffix");
    }
}
