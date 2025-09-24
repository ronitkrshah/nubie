import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

export default function scopedDiContainerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const scope = container.createChildContainer();
    req.scope = scope;

    res.on("finish", () => {
        req.scope.dispose();
    });

    next();
}
