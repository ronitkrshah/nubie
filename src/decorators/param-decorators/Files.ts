import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class FilesDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.files;
    }
}

const Files = ParamExtensionDecorator.createDecorator(FilesDecorator);

export default Files;
