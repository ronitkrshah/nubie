import { NextFunction, Request, Response } from "express";
import { AppContext } from "../../../AppContext";

export function createDiScopeMiddleware(req: Request, res: Response, next: NextFunction) {
    req.serviceContainer =
        AppContext.getInstance().serviceContainer.container.createChildContainer();

    res.on("finish", async () => {
        req.serviceContainer.dispose();
    });

    next();
}
