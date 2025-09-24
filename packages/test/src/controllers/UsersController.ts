import {
    ApiController,
    HttpPost,
    HttpResponse,
    WebSocketController,
    WebSocketControllerBase,
} from "@nubie/framework";
import { IsString } from "class-validator";
import { Socket, DisconnectReason } from "socket.io";

class Dto {
    @IsString()
    public name!: string;
}

@WebSocketController("/abc")
class AbcController extends WebSocketControllerBase {
    public constructor() {
        super();
    }

    onConnection(socket: Socket): Promise<void> {
        throw new Error("Method not implemented.");
    }
    onDisconnect(socket: Socket, reason: DisconnectReason): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
