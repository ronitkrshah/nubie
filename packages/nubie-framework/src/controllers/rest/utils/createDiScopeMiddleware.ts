import { NextFunction, Request, Response } from "express";
import { ServiceContainer } from "../../../core/dependency-injection";

export function createDiScopeMiddleware(req: Request, res: Response, next: NextFunction) {
    req.serviceContainer = ServiceContainer.createChildContainer().container;

    res.on("finish", async () => {
        req.serviceContainer.dispose();
    });

    next();
}
