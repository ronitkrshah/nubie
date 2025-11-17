import { IConfiguration } from "./IConfiguration";
import path from "node:path";
import * as fs from "node:fs";
import deepmerge from "deepmerge";

const DEFAULT_CONFIG: IConfiguration = {
    allowedHosts: "*",
    controllersDirectory: "controllers",
    fileUploadDirectory: "uploads",
    port: 5173,
};

class Configuration {
    public readonly ROOT_DIR = path.resolve();
    public readonly CONFIG_FILE = "nubie.json";

    private _config: IConfiguration | null = null;

    public get options(): IConfiguration {
        if (!this._config) {
            try {
                const configPath = path.join(this.ROOT_DIR, this.CONFIG_FILE);
                if (fs.existsSync(configPath)) {
                    const rawData = fs.readFileSync(configPath, { encoding: "utf-8" });
                    const parsedData: IConfiguration = JSON.parse(rawData);
                    this._config = deepmerge(this._config || {}, parsedData);
                } else {
                    this._config = DEFAULT_CONFIG;
                }
            } catch {
                this._config = DEFAULT_CONFIG;
            }
        }
        return this._config;
    }

    public getSection<TSection extends keyof IConfiguration>(
        key: TSection,
    ): IConfiguration[TSection] {
        return this._config?.[key];
    }
}

export default new Configuration();
