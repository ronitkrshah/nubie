import path from "node:path";
import * as fs from "node:fs/promises";
import { NubieConfig } from "../config";

// Just fancy name copied from .NET :)

/**
 * Runtime helper class get compiled js paths
 */
class Assembly {
    public async scanFilesAsync(
        fileSuffix: string | string[],
        parentDir?: string,
    ): Promise<string[]> {
        const fileNames = Array.isArray(fileSuffix) ? fileSuffix : [fileSuffix];
        const searchDir = parentDir
            ? path.join(NubieConfig.ProjectPath, "build", ...parentDir.split("/"))
            : path.join(NubieConfig.ProjectPath, "build");

        const files = await fs.readdir(searchDir, { recursive: true, withFileTypes: true });

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
