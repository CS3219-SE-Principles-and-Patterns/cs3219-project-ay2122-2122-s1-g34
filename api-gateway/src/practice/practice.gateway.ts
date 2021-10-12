import { Injectable } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import { PracticeService } from "./practice.service";

@Injectable()
@WebSocketGateway()
export class PracticeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly practiceService: PracticeService) {}

  handleConnection(client: Socket) {
    return this.practiceService.handleSocketConnection(client);
  }

  handleDisconnect(client: Socket) {}
}
