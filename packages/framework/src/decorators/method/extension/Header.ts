import type { Request } from "express";
import { MethodExtensionDecorator } from "../../../abstractions";
import { HeaderNotFoundException } from "../../../exceptions";

class HeaderDecorator extends MethodExtensionDecorator {
    public constructor(public readonly key: string) {
        super();
    }

    public async executeAsync(req: Request): Promise<void> {
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
