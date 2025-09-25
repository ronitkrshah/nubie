import "reflect-metadata";
import Nubie from "./Nubie";
import { JWTToken, HttpResponse, RateLimit } from "./core";
import {
    MethodExtensionDecorator,
    ParamExtensionDecorator,
} from "./abstractions/decorator-extensions";
import { WebSocketControllerBase } from "./abstractions/controller";
import { Exception } from "./utils";
import { type IServiceCollection } from "./di";
import { inject } from "tsyringe";
import { Module } from "./abstractions/module";
import type { IConfig } from "./config";

export * from "./decorators/class-decorators";
export * from "./decorators/method-decorators";
export * from "./decorators/param-decorators";

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
