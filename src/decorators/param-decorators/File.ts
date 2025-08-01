import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../../abstracts";

class FileDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.file;
    }
}

const File = ExtensionParamDecorator.createDecorator(FileDecorator);

export default File;
