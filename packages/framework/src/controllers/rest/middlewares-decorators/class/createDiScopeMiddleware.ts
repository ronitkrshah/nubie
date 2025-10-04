import { NextFunction, Request, Response } from "express";
import { DIContainer } from "@nubie/di";

export function createDiScopeMiddleware(req: Request, res: Response, next: NextFunction) {
    req.diContainer = DIContainer.createScope();

    res.on("finish", async () => {
        req.diContainer.dispose();
    });

    next();
}
