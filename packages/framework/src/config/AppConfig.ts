import path from "path";
import * as FileSystem from "node:fs/promises";
import { IConfig } from "./IConfig";

const DEFAULT_NUBIE_CONFIG: IConfig = {
    port: 8080,
    defaultApiVersion: 1,
    controllersDirectory: "controllers",
};

class AppConfig {
    public readonly projectPath = path.resolve();

    private _isLoaded = false;
    private _config: IConfig = DEFAULT_NUBIE_CONFIG;
    private readonly _configFile = path.join(this.projectPath, "nubie.config.js");

    public async getConfig(): Promise<IConfig> {
        if (this._isLoaded) return this._config;
        try {
            const fileStat = await FileSystem.stat(this._configFile);
            if (!fileStat.isFile()) throw new Error("Config Isn't A File");
            const mod: { default: IConfig } = await import(this._configFile);
            this._config = {
                ...this._config,
                ...mod.default,
            };
            this._isLoaded = true;
        } catch {
            this._isLoaded = false;
        }

        return this._config;
    }
}

export default new AppConfig();
