import "express";
import { JwtPayload } from "jsonwebtoken";
import type { DependencyContainer } from "tsyringe";

declare module "express-serve-static-core" {
    interface Request {
        scope: DependencyContainer;
        user?: JwtPayload;
    }
}
