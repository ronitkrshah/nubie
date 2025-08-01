import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";

class FilesDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.files;
    }
}

const Files = ExtensionParamDecorator.createDecorator(FilesDecorator);

export default Files;
