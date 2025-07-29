import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class FilesDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.files;
    }
}

const Files = NubieExtensionParamDecorator.createDecorator(FilesDecorator);

export default Files;
