import { Injectable } from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import { CollaborationService } from "./collaboration.service";

@Injectable()
@WebSocketGateway()
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly collaborationService: CollaborationService) {}

  handleConnection(client: Socket) {
    this.collaborationService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.collaborationService.handleDisconnect(client);
  }

  @SubscribeMessage("collaboration")
  handleCollaboration(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string
  ) {
    this.collaborationService.handleCollaboration(client, data);
  }
}
