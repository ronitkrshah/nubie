import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class FilesDecorator extends RestParamExtension {
    public async handleAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.files;
    }
}

export const Files = RestParamExtension.createDecorator(FilesDecorator);
