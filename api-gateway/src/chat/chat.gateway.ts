import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
    ConnectedSocket
   } from '@nestjs/websockets';
   import { Socket, Server } from 'socket.io';

   import { ChatService } from './chat.service';
   
   @WebSocketGateway()
   export class ChatGateway {
   
    @WebSocketServer() server: Server
   
    constructor(
        private readonly chatService: ChatService
      ) {}

    @SubscribeMessage('chat:send_message') //for a socket to send msg
    handleChat(@ConnectedSocket() client: Socket,@MessageBody() payload: Object) {
        this.chatService.handleChat(client, payload);
    }
   }