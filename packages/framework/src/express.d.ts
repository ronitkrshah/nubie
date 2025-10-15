import "express";
import type { IContainer } from "@nubie/di";

declare module "express-serve-static-core" {
    interface Request {
        diContainer: IContainer;
    }
}
