import "reflect-metadata";
import Nubie from "./Nubie";
import { JWTToken, HttpResponse, RateLimit } from "./Core";
import {
    MethodExtensionDecorator,
    ParamExtensionDecorator,
} from "./Abstractions/DecoratorExtensions";
import { WebSocketControllerBase } from "./Abstractions/Controller";
import { Exception } from "./Utilities";
import { type IServiceCollection } from "./DependencyInjection";
import { inject } from "tsyringe";
import { Module } from "./Abstractions/Module";
import type { IConfig } from "./Config";

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
    Module,
    IConfig,
};
