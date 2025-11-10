import { NextFunction, Response, Request } from "express";

export type THttpContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};
