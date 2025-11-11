import { ClassNotFoundException } from "./exceptions";
import { createRequire } from "node:module";
import { ClassIntrospector } from "../../../generic/ClassIntrospector";

// @ts-ignore
const require = createRequire(import.meta.url);

type TModule = {
    default?: TClass;
};

class ClassResolver {
    public resolve(filePath: string): TClass {
        const fileName = filePath.split("/").pop()?.replace(".js", "")!;

        const mod = require(filePath) as TModule;
        if (!mod.default) throw new ClassNotFoundException();

        const isClass = mod.toString().startsWith("class");
        if (!isClass) throw new ClassNotFoundException();
        if (fileName !== mod.default.name) throw new ClassNotFoundException();
        return mod.default;
    }
}

export default new ClassResolver();
