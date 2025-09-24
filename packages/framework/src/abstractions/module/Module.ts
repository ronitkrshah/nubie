import path from "node:path";
import * as FileSystem from "node:fs/promises";
import { AppConfig } from "../../config";
import ModuleClassMethods from "./ModuleClassMethods";
import { TConstructor } from "../../types";
import { IServiceCollection, ServiceCollection } from "../../di";

interface IModuleService {
    service: IServiceCollection;
    methods: ModuleClassMethods;
    metadata: {
        className: string;
        constructor: TConstructor;
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
                const mod = await import(path.join(file.parentPath, file.name));
                if (options?.onlyImport) continue;
                if (this.isClass(mod?.default)) {
                    const service = ServiceCollection;
                    const methods = new ModuleClassMethods(mod.default);
                    const obj: IModuleService = {
                        service,
                        methods,
                        metadata: {
                            className: mod.default.name,
                            constructor: mod.default,
                        },
                    };
                    retVal.push(obj);
                }
            }
        }

        return retVal;
    }

    /**
     * Check If the param is a class
     */
    private isClass(value: unknown): value is new (...args: any[]) => any {
        return (
            typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value))
        );
    }
}

export default new Module();
