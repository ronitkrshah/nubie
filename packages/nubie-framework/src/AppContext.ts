import express, { Express } from "express";
import { NubieConfig } from "./core/config";
import { BaseClassDecorator } from "./abstractions";
import { ServiceContainer } from "./core/dependency-injection";

export class AppContext {
    private static _instance: AppContext;

    public express: Express;
    public config: NubieConfig;
    public serviceContainer: ServiceContainer;

    public classDecorators: BaseClassDecorator[] = [];

    private constructor(express: Express, config: NubieConfig) {
        this.express = express;
        this.config = config;
        this.serviceContainer = ServiceContainer.createChildContainer();
    }

    private static create() {
        const app = express();
        const config = NubieConfig.generateConfig();
        return new AppContext(app, config);
    }

    public static getInstance(): AppContext {
        if (!AppContext._instance) {
            this._instance = this.create();
        }

        return this._instance;
    }
}
