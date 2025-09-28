import { MethodDecorator } from "../../../abstractions";
import { MulterFileUpload } from "../../../http";

export const enum FileUploadType {
    Single,
    Multiple,
    Fields,
}

type TUploadFields = { name: string; maxCount?: number }[];

class FileUploadDecorator extends MethodDecorator {
    public constructor(
        public readonly field: string | TUploadFields,
        public readonly uploadType: FileUploadType = FileUploadType.Single,
        public readonly maxCount?: number, // only for Multiple
    ) {
        super();
    }

    public async executeAsync(): Promise<void> {
        const metadata = this.getMethodMetadata();
        const middlewares = metadata[this._methodName]?.middlewares || [];

        let handler;

        if (Array.isArray(this.field)) {
            handler = MulterFileUpload.fields(this.field);
        } else {
            switch (this.uploadType) {
                case FileUploadType.Single:
                    handler = MulterFileUpload.single(this.field);
                    break;
                case FileUploadType.Multiple:
                    handler = MulterFileUpload.array(this.field, this.maxCount ?? 2);
                    break;
                default:
                    throw new Error("Invalid upload type.");
            }
        }

        this.updateMethodMetadata({
            middlewares: [...middlewares, handler],
        });
    }
}

/**
 * Enables file upload handling for the decorated method.
 *
 * Automatically parses multipart/form-data and attaches files to the request.
 */
export const FileUpload = MethodDecorator.createDecorator(FileUploadDecorator);
