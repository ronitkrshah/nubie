import "reflect-metadata";
import Nubie from "./Nubie";
import { MethodExtensionDecorator, ParamExtensionDecorator } from "./abstractions";
import { WebSocketControllerBase } from "./abstractions";
import { Exception } from "./exceptions";
import type { IServiceCollection } from "./extensions";
import { inject } from "tsyringe";
import { BuildScanner } from "./runtime";
import type { IConfiguration } from "./configuration";
import { JwtToken } from "./security";
import { HttpResponse, RateLimit } from "./http";
import { ApplicationConfig } from "./configuration";

export * from "./decorators/class";
export * from "./decorators/method";
export * from "./decorators/param";

export {
    Nubie,
    MethodExtensionDecorator,
    ParamExtensionDecorator,
    JwtToken,
    HttpResponse,
    Exception,
    WebSocketControllerBase,
    IServiceCollection,
    RateLimit,
    inject as Inject,
    BuildScanner,
    IConfiguration,
    ApplicationConfig,
};
