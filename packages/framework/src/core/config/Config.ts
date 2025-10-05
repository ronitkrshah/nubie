import { IConfig } from "./IConfig";
import path from "node:path";
import * as fs from "node:fs/promises";
import deepmerge from "deepmerge";

const DEFAULT_CONFIG: IConfig = {
    http: {
        port: 3000,
        defaultApiVersion: 1,
        useApiVersioning: false,
    },
    mappings: {
        controllersDirectory: "controllers",
    },
    cors: {
        allowedOrigins: "*",
    },
};

export class Config {
    public static readonly Token = Symbol("nubie:internal:config");
    public static readonly ProjectPath = path.resolve();
    public static readonly ConfigFile = "nubie.json";

    private _config: IConfig = DEFAULT_CONFIG;

    public getConfig() {
        return this._config;
    }

    public getSection<TSection extends keyof IConfig>(key: TSection): IConfig[TSection] {
        return this._config[key];
    }

    public async loadConfigAsync() {
        try {
            const rawData = await fs.readFile(Config.ConfigFile, { encoding: "utf-8" });
            const parsedData: IConfig = JSON.parse(rawData);
            this._config = deepmerge(this._config, parsedData);
        } catch {}
    }
}
