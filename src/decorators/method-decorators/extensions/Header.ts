import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../abstracts";
import { HttpStatusCodes } from "../../../core";
import { NubieError } from "../../../helpers";

class HeaderDecorator extends MethodExtensionDecorator {
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

const Header = MethodExtensionDecorator.createDecorator(HeaderDecorator);

export default Header;
