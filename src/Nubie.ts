import express, { Express } from "express";
import { AppConfiguration } from "./config";
import AppContext from "./AppContext";
import NubieCore from "./NubieCore";
import OS from "node:os";

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

    private showEnvironmentDetails(): void {
        console.log("🔧 Environment:");
        console.log(`\t• Node               : ${process.version}`);
        console.log(`\t• Platform           : ${process.platform} (${process.arch})`);
        console.log(`\t• Total RAM          : ${(OS.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
        console.log(`\t• Available RAM      : ${(OS.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    }

    public async runAsync() {
        console.log("🌟 Application Boot Sequence Initialized...");
        this.showEnvironmentDetails();

        await NubieCore.setupRouterAsyc();
        const config = await AppConfiguration.getAppConfigAsync();

        this._expressApp.listen(config.port, () => {
            console.log("\n🔗 Connected to Web API at: http://localhost:4321");
        });
    }
}
