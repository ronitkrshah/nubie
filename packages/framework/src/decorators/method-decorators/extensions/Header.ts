import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../abstractions/decorator-extensions";
import { HttpStatusCodes } from "../../../core";
import { Exception } from "../../../utils";
import { HeaderNotFoundException } from "../../../exceptions/req";

class HeaderDecorator extends MethodExtensionDecorator {
    public constructor(public readonly key: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const headers = req.headers;

        if (headers[this.key]) return;

        throw new HeaderNotFoundException(this.key);
    }
}

/**
 * Extracts and validates headers from the incoming request.
 */
const Header = MethodExtensionDecorator.createDecorator(HeaderDecorator);

export default Header;
