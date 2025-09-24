import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class FilesDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.files;
    }
}

/**
 * Injects multiple uploaded files into the method parameter.
 */
const Files = ParamExtensionDecorator.createDecorator(FilesDecorator);

export default Files;
