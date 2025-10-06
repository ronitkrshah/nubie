import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class FileDecorator extends RestParamExtension {
    public async handleAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.file;
    }
}

export const File = RestParamExtension.createDecorator(FileDecorator);
