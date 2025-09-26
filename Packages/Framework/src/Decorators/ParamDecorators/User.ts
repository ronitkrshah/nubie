import type { Request } from "express";
import { ParamExtensionDecorator } from "../../Abstractions/DecoratorExtensions";
import { UnauthorizedAccessException } from "../../Exceptions/Authentication";

class UserDecorator extends ParamExtensionDecorator {
    constructor() {
        super();
    }

    public async executeAsync(req: Request): Promise<unknown> {
        if (!req.user) throw new UnauthorizedAccessException();
        return req.user;
    }
}

/**
 * Injects a single uploaded file into the method parameter.
 */
const User = ParamExtensionDecorator.createDecorator(UserDecorator);

export default User;
