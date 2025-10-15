import { ClassNotFoundException } from "./ClassNotFoundException";
import { createRequire } from "node:module";

// @ts-ignore
const require = createRequire(import.meta.url);

export class ClassResolver {
    private readonly _filePath: string;
    private readonly _fileName: string;
    private _module: { default?: TClass } | null = null;

    public constructor(filePath: string) {
        this._filePath = filePath;
        this._fileName = filePath.split("/").pop()?.replace(".js", "")!;
    }

    private validateClass(exportedClass: TClass) {
        const isClass = exportedClass.toString().startsWith("class");
        if (!isClass) throw new ClassNotFoundException();
        if (this._fileName !== exportedClass.name) throw new ClassNotFoundException();
    }

    public loadClass() {
        this._module = require(this._filePath);
        if (!this._module || !this._module?.default) throw new ClassNotFoundException();
        this.validateClass(this._module.default);
    }

    public unloadClass() {
        this._module = null;
        delete require.cache[require.resolve(this._filePath)];
    }
}
