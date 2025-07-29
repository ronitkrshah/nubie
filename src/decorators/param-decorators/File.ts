import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class FileDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.file;
    }
}

const File = NubieExtensionParamDecorator.createDecorator(FileDecorator);

export default File;
