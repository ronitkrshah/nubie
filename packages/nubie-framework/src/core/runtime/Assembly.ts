import path from "node:path";
import fs from "node:fs";
import { Configuration } from "../config";

/**
 * Runtime helper class get compiled js paths
 */
class Assembly {
    public scanFiles(
        fileSuffix: string | string[],
        parentDir?: string,
        recursive = true,
    ): string[] {
        const fileNames = Array.isArray(fileSuffix) ? fileSuffix : [fileSuffix];
        const searchDir = parentDir
            ? path.join(Configuration.ROOT_DIR, "build", ...parentDir.split("/"))
            : path.join(Configuration.ROOT_DIR, "build");

        const isDirExists = fs.existsSync(searchDir);
        if (!isDirExists) return [];

        const files = fs.readdirSync(searchDir, { recursive, withFileTypes: true });

        const retVal: string[] = [];

        for (const file of files) {
            if (!file.isFile()) continue;

            for (const suffix of fileNames) {
                if (!file.name.replace(".js", "").endsWith(suffix)) continue;
                retVal.push(path.join(file.parentPath, file.name));
            }
        }

        return retVal;
    }
}

export default new Assembly();
