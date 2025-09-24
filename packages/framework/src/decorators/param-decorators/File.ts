import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class FileDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.file;
    }
}

/**
 * Injects a single uploaded file into the method parameter.
 */
const File = ParamExtensionDecorator.createDecorator(FileDecorator);

export default File;
