import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server; // Use the non-null assertion operator (!)

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: any) {
    console.log('Message received:', message); // Debug log
    this.server.to(message.recipient).emit('message', message); // Send to recipient
    this.server.to(message.sender).emit('message', message); // Send to sender
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, username: string) {
    client.join(username); // Join the socket room with the username
  }
}
