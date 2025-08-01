import { Request, Response, NextFunction } from "express";
import { NubieError } from "~/helpers";
import { HttpStatusCodes } from "~/core";
import { ExtensionMethodDecorator } from "~/decorators/abstracts";

class HeaderDecorator extends ExtensionMethodDecorator {
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

const Header = ExtensionMethodDecorator.createDecorator(HeaderDecorator);

export default Header;
