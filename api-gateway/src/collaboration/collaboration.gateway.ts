import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import { CollaborationService } from "./collaboration.service";

@WebSocketGateway()
export class CollaborationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly collaborationService: CollaborationService) {}

  @SubscribeMessage("collaboration")
  handleCollaboration(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string
  ) {
    this.collaborationService.handleCollaboration(client, data);
  }
}
