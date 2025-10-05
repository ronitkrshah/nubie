import { InvalidDefaultClassException } from "./InvalidDefaultClassException";

export class DynamicImport {
    private readonly _filePath: string;
    private readonly _fileName: string;

    public constructor(filePath: string) {
        this._filePath = filePath;
        this._fileName = filePath.split("/").pop()?.replace(".js", "")!;
    }

    private isValidExportedClass(exportedClass: TClass) {
        const isClass = exportedClass.toString().startsWith("class");
        if (!isClass) throw new InvalidDefaultClassException();
        if (this._fileName !== exportedClass.name) throw new InvalidDefaultClassException();
    }

    public async importClassAsync() {
        const module = await import(this._filePath);
        const exportedClass: TClass = module.default.default;
        this.isValidExportedClass(exportedClass);
    }
}
