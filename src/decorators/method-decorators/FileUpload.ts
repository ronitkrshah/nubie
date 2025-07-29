import * as FileSystem from "node:fs/promises";
import { FileUploadHandler } from "../../core";
import { NubieMethodDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";
import path from "node:path";

export const enum FileUploadType {
    Single,
    Multiple,
    Fields,
}

type TUploadFields = { name: string; maxCount?: number }[];

class FileUploadDecorator extends NubieMethodDecorator {
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
            handler = FileUploadHandler.fields(this.field);
        } else {
            switch (this.uploadType) {
                case FileUploadType.Single:
                    handler = FileUploadHandler.single(this.field);
                    break;
                case FileUploadType.Multiple:
                    handler = FileUploadHandler.array(this.field, this.maxCount ?? 2);
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

export const FileUpload = NubieMethodDecorator.createDecorator(FileUploadDecorator);
