import type { Request } from "express";
import { ParamExtensionDecorator } from "../../Abstractions";

class FileDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request): Promise<unknown> {
        return req.file;
    }
}

/**
 * Injects a single uploaded file into the method parameter.
 */
const File = ParamExtensionDecorator.createDecorator(FileDecorator);

export default File;
