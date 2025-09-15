import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { UnauthorizedAccessException } from "../../exceptions/authentication";

class UserDecorator extends ParamExtensionDecorator {
    constructor() {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (!req.user) throw new UnauthorizedAccessException();
        return req.user;
    }
}

/**
 * Injects a single uploaded file into the method parameter.
 */
const User = ParamExtensionDecorator.createDecorator(UserDecorator);

export default User;
