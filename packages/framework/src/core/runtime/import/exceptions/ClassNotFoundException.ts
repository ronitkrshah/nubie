import { Exception } from "../../../../utils";

export class ClassNotFoundException extends Exception {
    public constructor() {
        super("Invalid Default Class");
    }
}
