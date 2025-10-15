import "express";
import type { IDIContainer } from "@nubie/di";

declare module "express-serve-static-core" {
    interface Request {
        diContainer: IDIContainer;
    }
}
