import { BaseMethodDecorator } from "../../../../abstractions";
import { IRestConfig } from "../../IRestConfig";
import path from "node:path";
import { Config } from "../../../../core/config";
import multer from "multer";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import e, { RequestHandler } from "express";
import { ObjectEditor } from "../../../../utils";

export type TFileUploadOptions = {
    field?: string;
    multiple?: boolean;
    maxCount?: number;
    maxFileSize?: number;
    allowedMimeTypes?: string[];
    fields?: { name: string; maxCount?: number }[];
};

class FileUploadDecorator extends BaseMethodDecorator<IRestConfig> {
    public constructor(public readonly options: TFileUploadOptions = {}) {
        super();
    }

    public async init(): Promise<void> {
        const uploadDir = path.join(Config.ProjectPath, "uploads");

        const storage = multer.diskStorage({
            destination: (_, __, cb) => cb(null, uploadDir),
            filename: (_, file, cb) => {
                const ext = mime.extension(file.mimetype) || "bin";
                cb(null, `${uuidv4()}.${ext}`);
            },
        });

        const fileUploader = multer({
            storage,
            limits: {
                fileSize: this.options.maxFileSize || undefined,
            },
            fileFilter:
                Array.isArray(this.options.allowedMimeTypes) &&
                this.options.allowedMimeTypes.length > 0
                    ? (
                          _req: e.Request,
                          file: Express.Multer.File,
                          callback: multer.FileFilterCallback,
                      ) => {
                          this.options.allowedMimeTypes?.includes(file.mimetype)
                              ? callback(null, true)
                              : callback(new Error("Invalid Mime Type"));
                      }
                    : undefined,
        });

        let requestHandler: RequestHandler;
        if (this.options.fields) {
            requestHandler = fileUploader.fields(this.options.fields);
        } else if (this.options.multiple) {
            requestHandler = fileUploader.array(
                this.options.field || "file",
                this.options.maxCount || 10,
            );
        } else {
            requestHandler = fileUploader.single(this.options.field || "file");
        }

        const metadata = this.getClassMetadata();
        const editor = new ObjectEditor(metadata);
        editor.mutateState((state) => {
            // @ts-ignore
            (state.requestHandlers ??= {})[this.propertyKey] ??= {};
            // @ts-ignore
            state.requestHandlers[this.propertyKey].nativeMiddlewares ??= [];

            state.requestHandlers[this.propertyKey]?.nativeMiddlewares?.push(requestHandler);
        });

        this.updateClassMetadata(editor.getState());
    }
}

export const FileUpload = BaseMethodDecorator.createDecorator(FileUploadDecorator);
