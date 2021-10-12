import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import { PracticeService } from "./practice.service";

@WebSocketGateway()
export class PracticeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly practiceService: PracticeService) {}

  handleConnection(client: Socket) {
    return this.practiceService.handleSocketConnection(client, this.server);
  }
}
