import { INubieConfig } from "./INubieConfig";
import path from "node:path";
import * as fs from "node:fs";
import deepmerge from "deepmerge";

const DEFAULT_CONFIG: INubieConfig = {
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

export class NubieConfig {
    public static readonly ProjectPath = path.resolve();
    public static readonly ConfigFile = "nubie.json";

    private _config: INubieConfig = DEFAULT_CONFIG;

    private constructor() {}

    public static generateConfig(): NubieConfig {
        const instance = new NubieConfig();
        instance.loadConfig();
        return instance;
    }

    public getConfig() {
        return this._config;
    }

    public getSection<TSection extends keyof INubieConfig>(key: TSection): INubieConfig[TSection] {
        return this._config[key];
    }

    private loadConfig() {
        try {
            const rawData = fs.readFileSync(NubieConfig.ConfigFile, { encoding: "utf-8" });
            const parsedData: INubieConfig = JSON.parse(rawData);
            this._config = deepmerge(this._config, parsedData);
        } catch {}
    }
}
