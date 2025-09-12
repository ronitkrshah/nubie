import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
import { HttpStatusCodes } from "../../../core";
import { NubieError } from "../../../utils";

class HeaderDecorator extends MethodExtensionDecorator {
    public constructor(public readonly key: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const headers = req.headers;

        if (headers[this.key]) return;

        throw new NubieError(
            "Required header missing — the request feels incomplete.",
            HttpStatusCodes.BadRequest,
            `${this.key} Is Missing In Request Headers`,
        );
    }
}

const Header = MethodExtensionDecorator.createDecorator(HeaderDecorator);

export default Header;
