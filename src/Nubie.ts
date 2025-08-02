import express, { Express } from "express";
import { AppConfiguration } from "./config";
import { Logger } from "./helpers";
import AppContext from "./AppContext";
import NubieCore from "./NubieCore";

export default class Nubie {
    private _expressApp: Express;

    public get ExpressApp() {
        return this._expressApp;
    }

    private constructor() {
        this._expressApp = express();
        this._expressApp.use(express.json());
        this._expressApp.use(express.urlencoded({ extended: false }));
        AppContext.ExpressApp = this._expressApp;
    }

    public static createApp(): Nubie {
        return new Nubie();
    }

    public async runAsync() {
        await NubieCore.setupRouterAsyc();
        const config = await AppConfiguration.getAppConfigAsync();

        Logger.title("Installing Skill Issue Fix...");

        this._expressApp.listen(config.port, () => {
            Logger.info(`WebAPI Url: http://127.0.0.1:${config.port}`);
            Logger.success("Skill Issues Fixed :)");
        });
    }
}
