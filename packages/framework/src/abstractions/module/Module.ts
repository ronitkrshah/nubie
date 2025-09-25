import path from "node:path";
import * as FileSystem from "node:fs/promises";
import { AppConfig } from "../../config";
import ModuleClassMethods from "./ModuleClassMethods";
import type { TConstructor } from "../../types";
import type { IServiceCollection } from "../../di";
import { ServiceCollection } from "../../di";
import { Logger } from "../../utils";

interface IModuleService {
    service: IServiceCollection;
    methods: ModuleClassMethods;
    metadata: {
        className: string;
        constructor: TConstructor;
        fileName: string;
        filePath: string;
    };
}

class Module {
    /**
     * Scans files in the build directory (and its subdirectories) that end with the given suffix,
     * and returns an array of classes exported as default from those files.
     *
     * This method accepts an optional parent directory to limit the scanning scope,
     * reducing file system calls and improving performance.
     */
    public async scanFilesAsync(
        fileNameSuffix: string | string[],
        options?: { parentDir?: string; onlyImport?: boolean },
    ): Promise<IModuleService[]> {
        const fileNames = Array.isArray(fileNameSuffix) ? fileNameSuffix : [fileNameSuffix];
        const scanPath = options?.parentDir
            ? path.join(AppConfig.projectPath, "build", ...options.parentDir.split("/"))
            : path.join(AppConfig.projectPath, "build");

        const files = await FileSystem.readdir(scanPath, {
            recursive: true,
            withFileTypes: true,
        });

        const retVal: IModuleService[] = [];

        for (const file of files) {
            if (!file.isFile()) continue;

            for (const suffix of fileNames) {
                if (!file.name.endsWith(`${suffix}.js`)) continue;
                const module: { default: { default: TConstructor } } = await import(
                    path.join(file.parentPath, file.name)
                );

                // Check if it's a class
                if (!module.default.default.toString().startsWith("class")) {
                    Logger.log(
                        `File "${file.name.replace(".js", ".ts")}" must export a default class. Default export is required for dynamic loading.`,
                    );
                    process.exit(0);
                }

                if (options?.onlyImport) continue;
                const methods = new ModuleClassMethods(module.default.default);
                const obj: IModuleService = {
                    service: ServiceCollection,
                    methods,
                    metadata: {
                        className: module.default.default.name,
                        constructor: module.default.default,
                        fileName: file.name,
                        filePath: file.parentPath,
                    },
                };
                retVal.push(obj);
            }
        }

        return retVal;
    }

    /**
     * Check If the param is a class
     */
    private isClass(value: object): boolean {
        return value.toString().startsWith("class");
    }
}

export default new Module();
