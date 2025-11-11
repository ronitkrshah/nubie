import { Exception } from "../../../../exceptions";

export class ClassNotFoundException extends Exception {
    public constructor() {
        super("Invalid Default Class");
    }
}
