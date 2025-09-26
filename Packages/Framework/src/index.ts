import "reflect-metadata";
import Nubie from "./Nubie";
import { JWTToken, HttpResponse, RateLimit } from "./Core";
import {
    MethodExtensionDecorator,
    ParamExtensionDecorator,
} from "./Abstractions/DecoratorExtensions";
import { WebSocketControllerBase } from "./Abstractions/Controller";
import { Exception } from "./Utilities";
import { type IServiceCollection } from "./Extensions/ServiceCollection";
import { inject } from "tsyringe";
import { BuildScanner } from "./Runtime/BuildScanner";
import type { IConfiguration } from "./Configuration";

export * from "./Decorators/ClassDecorators";
export * from "./Decorators/MethodDecorators";
export * from "./Decorators/ParamDecorators";

export {
    Nubie,
    MethodExtensionDecorator,
    ParamExtensionDecorator,
    JWTToken,
    HttpResponse,
    Exception,
    WebSocketControllerBase,
    IServiceCollection,
    RateLimit,
    inject as Inject,
    BuildScanner,
    IConfiguration,
};
