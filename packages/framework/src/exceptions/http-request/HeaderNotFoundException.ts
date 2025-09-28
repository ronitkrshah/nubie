import { HttpStatusCodes } from "../../http";
import Exception from "../Exception";

export default class HeaderNotFoundException extends Exception {
    public constructor(header: string) {
        super(`Header ${header} was expected but not provided in the request.`, HttpStatusCodes.BadRequest);
    }
}
