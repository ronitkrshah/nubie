import * as http from "node:http";
import { Express } from "express";

export class HttpApp {
    public static readonly Token = Symbol("nubie:internal:httpApp");

    public constructor(
        public readonly httpServer: http.Server,
        public readonly express: Express,
    ) {}
}
