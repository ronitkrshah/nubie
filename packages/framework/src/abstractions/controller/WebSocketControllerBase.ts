import { DisconnectReason, Namespace, Socket } from "socket.io";

export default abstract class WebSocketControllerBase {
    public io!: Namespace;
    abstract onConnection(socket: Socket): Promise<void>;
    abstract onDisconnect(socket: Socket, reason: DisconnectReason): Promise<void>;
}
