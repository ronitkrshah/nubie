import { Exception } from "../../../../utils";

export class MissingJwtSecretException extends Exception {
    public constructor() {
        super("JWT Secret not defined in nubie.json");
    }
}
