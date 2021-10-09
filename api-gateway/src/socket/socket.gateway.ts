import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

import { SocketService } from "./socket.service";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.socketService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleDisconnect(client);
  }

  @SubscribeMessage("collaboration")
  handleCollaboration(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string
  ) {
    this.socketService.handleCollaboration(client, data);
  }
}
