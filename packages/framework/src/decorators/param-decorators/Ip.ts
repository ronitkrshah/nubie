import type { Request } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class IpDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request): Promise<string | undefined> {
        return req.ip;
    }
}

/**
 * Injects the client's IP address into the method parameter.
 */
const Ip = ParamExtensionDecorator.createDecorator(IpDecorator);

export default Ip;
