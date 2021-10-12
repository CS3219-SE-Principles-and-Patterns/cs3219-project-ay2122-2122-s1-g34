import {
  OnGatewayConnection,
  SubscribeMessage,
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

  /**
   * User has connected to room and sent a request to initialize session
   */
  @SubscribeMessage("practice:init")
  practiceInit(client: Socket) {
    return this.practiceService.practiceInit(client);
  }
}
