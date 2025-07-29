import multer from "multer";
import { NubieAppConfig } from "../config";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(NubieAppConfig.projectPath, "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const baseUploader = multer({ storage });

const FileUploadHandler = {
    single: (field: string) => baseUploader.single(field),
    array: (field: string, maxCount = 10) => baseUploader.array(field, maxCount),
    fields: (fields: { name: string; maxCount?: number }[]) => baseUploader.fields(fields),
};

export default FileUploadHandler;
