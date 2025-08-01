import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstracts";

class FileDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.file;
    }
}

const File = ParamExtensionDecorator.createDecorator(FileDecorator);

export default File;
