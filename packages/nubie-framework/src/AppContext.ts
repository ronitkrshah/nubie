import { Express } from "express";
import { BaseClassDecorator } from "./abstractions";

export class AppContext {
    private static _instance: AppContext;

    public express: Express;
    public classDecorators: BaseClassDecorator[] = [];

    private constructor(express: Express) {
        this.express = express;
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
