import type { Request } from "express";
import { ParamExtensionDecorator } from "../../Abstractions";

class FilesDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request) {
        return req.files;
    }
}

/**
 * Injects multiple uploaded files into the method parameter.
 */
const Files = ParamExtensionDecorator.createDecorator(FilesDecorator);

export default Files;
