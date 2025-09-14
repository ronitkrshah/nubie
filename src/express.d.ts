import "express";
import type { DependencyContainer } from "tsyringe";

declare module "express-serve-static-core" {
    interface Request {
        scope: DependencyContainer;
    }
}
