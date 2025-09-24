# WebSocket Controllers in Nubie (Beta)
> ⚠️ Beta Notice: WebSocket controller support in Nubie is currently in beta. While stable for development use, APIs and behavior may evolve. Feedback is welcome to help shape the final release.

WebSocket controllers in Nubie allow you to handle real-time socket connections using a class-based structure. Simply extend `WebSocketControllerBase` and decorate your class with `@WebSocketController()` to register it.

```ts
import { WebSocketController, WebSocketControllerBase } from "nubie";
import { Socket, DisconnectReason } from "socket.io";

@WebSocketController("/notifications")
class NotificationsController extends WebSocketControllerBase {
  public async onConnection(socket: Socket): Promise<void> {
    console.log(`Connected: ${socket.id}`);
    this.io.emit("user:connected", { id: socket.id });
  }

  public async onDisconnect(socket: Socket, reason: DisconnectReason): Promise<void> {
    console.log(`Disconnected: ${socket.id}, Reason: ${reason}`);
    this.io.emit("user:disconnected", { id: socket.id, reason });
  }
}

```