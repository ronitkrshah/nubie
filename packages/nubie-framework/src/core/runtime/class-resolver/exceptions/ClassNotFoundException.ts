import { Exception } from "../../../../exceptions";

export class ClassNotFoundException extends Exception {
    public constructor(message: string) {
        super(message);
    }
}
