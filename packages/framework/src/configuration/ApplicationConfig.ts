import path from "path";
import * as FileSystem from "node:fs/promises";
import type { IConfiguration } from "./IConfiguration";

const DEFAULT_NUBIE_CONFIG: IConfiguration = {
    Port: 8080,
    HttpRequest: {
        DefaultApiVersion: 1,
    },
    Mappings: {
        ControllerDirectory: "Controllers",
    },
} as const;

class ApplicationConfig {
    public readonly projectPath = path.resolve();

    private _config: IConfiguration = DEFAULT_NUBIE_CONFIG;
    private readonly _configFile = path.join(this.projectPath, "AppSettings.json");

    public get config() {
        return this._config;
    }

    public async loadConfigAsync(): Promise<void> {
        try {
            const fileStat = await FileSystem.stat(this._configFile);
            if (!fileStat.isFile()) throw new Error("Config Isn't A File");
            const rawFileContents = await FileSystem.readFile(this._configFile, { encoding: "utf-8" });
            const jsonData = JSON.parse(rawFileContents);

            this._config = {
                ...this._config,
                ...jsonData,
            };
        } catch {
            // Ignore...
        }
    }

    public getSection<TSection extends keyof IConfiguration>(sectionKey: TSection): IConfiguration[TSection] {
        return this.config[sectionKey];
    }
}

export default new ApplicationConfig();
