import { NextFunction, Request, Response } from "express";
import { GlobalContainer } from "@nubie/di";

export function createDiScopeMiddleware(req: Request, res: Response, next: NextFunction) {
    req.diContainer = GlobalContainer.createScope();

    res.on("finish", async () => {
        req.diContainer.dispose();
    });

    next();
}
