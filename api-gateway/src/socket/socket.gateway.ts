import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

import { CreateSocketDto } from "./dto/create-socket.dto";
import { UpdateSocketDto } from "./dto/update-socket.dto";
import { SocketService } from "./socket.service";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket, ...args: any[]) {
    throw new Error("Method not implemented.");
  }

  @SubscribeMessage("createSocket")
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage("findAllSocket")
  findAll() {
    return this.socketService.findAll();
  }

  @SubscribeMessage("findOneSocket")
  findOne(@MessageBody() id: number) {
    return this.socketService.findOne(id);
  }

  @SubscribeMessage("updateSocket")
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return this.socketService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage("removeSocket")
  remove(@MessageBody() id: number) {
    return this.socketService.remove(id);
  }
}
