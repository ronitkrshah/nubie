import path from "path";
import * as FileSystem from "node:fs/promises";

const _defaultConfiguration = {
    port: 4321,
    defaultApiVersion: 1,
    controllersDirectory: "controllers",
    buildDir: "dist",
    jwtSecretKey: undefined as string | undefined,
};

class AppConfiguration {
    public readonly projectPath = path.resolve();

    private _isLoaded = false;
    private _config = _defaultConfiguration;
    private readonly _configFile = "Nubie.json";

    public async getAppConfigAsync() {
        if (this._isLoaded) return this._config;
        this._isLoaded = true;
        try {
            const fileContents = await FileSystem.readFile(`${this.projectPath}/${this._configFile}`, {
                encoding: "utf-8",
            });
            const data: typeof this._config = JSON.parse(fileContents);

            this._config = {
                ...this._config,
                ...data,
            };
        } catch (error) {
            this._isLoaded = false;
        }

        return this._config;
    }
}

export default new AppConfiguration();
