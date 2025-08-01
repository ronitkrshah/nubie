import express, { Express } from "express";
import { NubieAppConfig } from "./config";
import { Logger } from "./helpers";
import { NubieAppService } from "./services";

export default class Nubie {
    private _expressApp: Express;

    public get expressApp() {
        return this._expressApp;
    }

    private constructor() {
        this._expressApp = express();
        this._expressApp.use(express.json());
        this._expressApp.use(express.urlencoded({ extended: false }));
    }

    public static createApp(): Nubie {
        return new Nubie();
    }

    public async runAsync() {
        const router = await NubieAppService.setupRouterAsyc();
        this._expressApp.use(router);
        const config = await NubieAppConfig.getAppConfigAsync();

        Logger.title("Installing Skill Issue Fix...");

        this._expressApp.listen(config.port, () => {
            Logger.info(`WebAPI Url: http://127.0.0.1:${config.port}`);
            Logger.success("Skill Issues Fixed :)");
        });
    }
}
