import { Module } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }
}

@Module({
  providers: [AppGateway],
})
export class WebSocketModule {}
