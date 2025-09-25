import multer from "multer";
import { AppConfig } from "../config";
import path from "path";
import { v4 } from "uuid";
import mime from "mime-types";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(AppConfig.projectPath, "uploads"));
    },
    filename: function (req, file, cb) {
        const fileName = v4() + "." + mime.extension(file.mimetype);
        cb(null, fileName);
    },
});

const baseUploader = multer({ storage });

const FileUploadHandler = {
    single: (field: string) => baseUploader.single(field),
    array: (field: string, maxCount = 10) => baseUploader.array(field, maxCount),
    fields: (fields: { name: string; maxCount?: number }[]) => baseUploader.fields(fields),
};

export default FileUploadHandler;
