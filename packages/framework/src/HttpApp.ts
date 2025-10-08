import * as http from "node:http";
import { Express } from "express";
import type { Server } from "socket.io";

export class HttpApp {
    public static readonly Token = Symbol("nubie:internal:httpApp");
    public socketIo?: Server = undefined;

    public constructor(
        public readonly httpServer: http.Server,
        public readonly express: Express,
    ) {}
}
