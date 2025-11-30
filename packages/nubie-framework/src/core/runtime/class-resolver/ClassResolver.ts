import { ClassNotFoundException } from "./exceptions";
import { createRequire } from "node:module";

// @ts-ignore
const require = createRequire(import.meta.url);

type TModule = {
    default?: TClass;
};

class ClassResolver {
    public resolve(filePath: string): TClass {
        const fileName = filePath.split("/").pop()?.replace(".js", "")!;
        const mod = require(filePath) as TModule;
        if (!mod.default) throw new ClassNotFoundException("No default exports found.");
        const isClass = mod.default.toString().startsWith("class");
        if (!isClass) throw new ClassNotFoundException("Default export must be a class.");
        if (fileName !== mod.default.name)
            throw new ClassNotFoundException(
                `File: ${fileName} :: Class: ${mod.default.name} - Must Be Same`,
            );
        return mod.default;
    }
}

export default new ClassResolver();
