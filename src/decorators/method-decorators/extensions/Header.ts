import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../../abstracts";
import { NubieError } from "../../../helpers";
import { HttpStatusCodes } from "../../../core";

class HeaderDecorator extends NubieExtensionMethodDecorator {
    public constructor(public readonly key: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const headers = req.headers;

        if (headers[this.key]) return;

        throw new NubieError(
            "MissingRequiredHeader",
            HttpStatusCodes.BadRequest,
            `${this.key} Is Missing In Request Headers`,
        );
    }
}

const Header = NubieExtensionMethodDecorator.createDecorator(HeaderDecorator);

export default Header;
