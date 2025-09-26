import path from "node:path";
import * as FileSystem from "node:fs/promises";
import { ApplicationConfig } from "../Configuration";
import { ClassIntrospector } from "../Extensions";
import { Logger } from "../Utilities";
import { ServiceCollection, type IServiceCollection } from "../Extensions/ServiceCollection";

interface IResolvedClass {
    service: IServiceCollection;
    introspector: ClassIntrospector;
    file: {
        name: string;
        path: string;
    };
}

class BuildScanner {
    /**
     * Scans files in the build directory (and its subdirectories) that end with the given suffix,
     * and returns an array of classes exported as default from those files.
     *
     * This method accepts an optional parent directory to limit the scanning scope,
     * reducing file system calls and improving performance.
     */
    public async scanFilesAsync(
        fileNameSuffix: string | string[],
        options?: { parentDir?: string },
    ): Promise<IResolvedClass[]> {
        const fileNames = Array.isArray(fileNameSuffix) ? fileNameSuffix : [fileNameSuffix];
        const directory = options?.parentDir ? `build/${options.parentDir}` : "build";
        const scanPath = path.join(ApplicationConfig.projectPath, ...directory.split("/"));

        const files = await FileSystem.readdir(scanPath, {
            recursive: true,
            withFileTypes: true,
        });

        const retVal: IResolvedClass[] = [];

        for (const file of files) {
            if (!file.isFile()) continue;

            for (const suffix of fileNames) {
                if (!file.name.endsWith(`${suffix}.js`)) continue;
                const module: { default: { default: Class } } = await import(path.join(file.parentPath, file.name));

                // Check if it's a class
                if (!module.default.default.toString().startsWith("class")) {
                    Logger.log(
                        `File "${file.name.replace(".js", ".ts")}" must export a default class. Default export is required for dynamic loading.`,
                    );
                    process.exit(0);
                }

                const introspector = new ClassIntrospector(module.default.default);
                const resolvedClass: IResolvedClass = {
                    service: ServiceCollection,
                    introspector,
                    file: {
                        name: file.name,
                        path: file.parentPath,
                    },
                };
                retVal.push(resolvedClass);
            }
        }

        return retVal;
    }
}

export default new BuildScanner();
