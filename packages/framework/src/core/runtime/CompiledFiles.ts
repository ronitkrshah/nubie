import path from "node:path";
import { Config } from "../config";
import * as fs from "node:fs/promises";

class CompiledFiles {
    public async scanFilesAsync(
        fileSuffix: string | string[],
        parentDir?: string,
    ): Promise<string[]> {
        const fileNames = Array.isArray(fileSuffix) ? fileSuffix : [fileSuffix];
        const searchDir = parentDir
            ? path.join(Config.ProjectPath, "build", ...parentDir.split("/"))
            : path.join(Config.ProjectPath, "build");

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

export default new CompiledFiles();
