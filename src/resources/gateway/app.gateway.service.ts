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
import { UserService } from '../user/user.service'
import { INotifyDTOgateway, IPlaceOrderDTOgateway } from './dto/gateway.dto'

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

  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    console.log('App Gateway initializied')
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const origin = client.handshake.headers.origin as EnumClientHOST
    switch (origin) {
      case EnumClientHOST.CLIENT:
        console.log(`CLIENT SOCKET: ${EnumClientHOST.CLIENT}`)
        const user = client.handshake.auth
        if (user?.userId) {
          console.log(`User ${user.userId} is ONLINE`)
          await this.userService.setUserOnlineStatus(+user.userId, true)
        }
      case EnumClientHOST.DASHBOARD:
        console.log(`DASHBOARD SOCKET: ${EnumClientHOST.DASHBOARD}`)
        this.server.emit('online', 'users online')
        break
      default:
        console.log('Unknown origin host')
    }
  }

  async handleDisconnect(client: any) {
    const origin = client.handshake.headers.origin as EnumClientHOST
    const user = client.handshake.auth

    switch (origin) {
      case EnumClientHOST.CLIENT:
        if (user?.userId) {
          await this.userService.setUserOnlineStatus(+user.userId, false)
          console.log(`User ${user.userId} is OFFLINE`)
        }
      case EnumClientHOST.DASHBOARD:
        this.server.emit('online', 'online users')
        break

      default:
        console.log('Unknown origin host')
    }
  }

  @SubscribeMessage('placeOrder')
  placeOrder(@MessageBody() message: IPlaceOrderDTOgateway) {
    this.server.emit('sendOrder', message)
  }

  @SubscribeMessage('sendNotification')
  changeOrderStatus(@MessageBody() body: INotifyDTOgateway) {
    this.server.emit('notify', body)
  }
}
