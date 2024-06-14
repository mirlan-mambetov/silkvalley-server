import { OnModuleInit } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { EnumClientHOST } from 'src/enums/App.gateway.enum'
import { IPlaceOrderDTOgateway } from './dto/gateway.dto'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  credentials: true,
})
export class AppGateWayService
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private usersOnline: any[] = []

  async onModuleInit() {
    console.log('App Gateway initializied')
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const origin = client.handshake.headers.origin as EnumClientHOST
    switch (origin) {
      case EnumClientHOST.CLIENT:
        console.log(`Silk Valley: ${EnumClientHOST.CLIENT}`)
        const user = client.handshake.auth
        if (user?.userId) {
          console.log(`User ${user.userId} is ONLINE`)
          if (!this.usersOnline.some((user) => user.userId === user.userId)) {
            this.usersOnline.push({ userId: user.userId })
          }
        }
      case EnumClientHOST.DASHBOARD:
        console.log(`Dashboard socket: ${EnumClientHOST.DASHBOARD}`)
        this.server.emit('online', this.usersOnline)
        break
      default:
        console.log('Unknown origin host')
    }
  }

  handleDisconnect(client: any) {
    const origin = client.handshake.headers.origin as EnumClientHOST
    const user = client.handshake.auth

    switch (origin) {
      case EnumClientHOST.CLIENT:
        if (user?.userId) {
          this.usersOnline = this.usersOnline.filter(
            (u) => u.userId !== user.userId,
          )
          console.log(`User ${user.userId} is OFFLINE`)
        }
      case EnumClientHOST.DASHBOARD:
        this.server.emit('online', this.usersOnline)
        break

      default:
        console.log('Unknown origin host')
    }
  }

  @SubscribeMessage('placeOrder')
  placeOrder(@MessageBody() message: IPlaceOrderDTOgateway) {
    this.server.emit('sendOrder', message)
  }
}
