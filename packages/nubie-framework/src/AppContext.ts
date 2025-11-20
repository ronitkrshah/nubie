import { Express } from "express";
import { BaseClassDecorator } from "./abstractions";
import { ServiceContainer } from "./core/dependency-injection";

export class AppContext {
    private static _instance: AppContext;

    public express: Express;
    public serviceContainer: ServiceContainer;
    public classDecorators: BaseClassDecorator[] = [];

    private constructor(express: Express) {
        this.express = express;
        this.serviceContainer = ServiceContainer.createChildContainer();
    }

    public static saveContext(app: Express) {
        this._instance = new AppContext(app);
        return this._instance;
    }

    public static getInstance(): AppContext {
        if (!AppContext._instance) throw new Error(`AppContext._instance must be defined`);
        return this._instance;
    }
}
