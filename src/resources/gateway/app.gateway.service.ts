import { OnModuleInit } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ClientEnumHost } from 'src/enums/App.gateway.enum'

@WebSocketGateway({
  cors: true,
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
    const origin = client.handshake.headers.origin as ClientEnumHost
    switch (origin) {
      case ClientEnumHost.CLIENT:
        console.log(`Silk Valley: ${ClientEnumHost.CLIENT}`)
        const user = client.handshake.auth
        if (user?.userId) {
          console.log(`User ${user.userId} is ONLINE`)
          if (!this.usersOnline.some((user) => user.userId === user.userId)) {
            this.usersOnline.push({ userId: user.userId })
          }
        }
      case ClientEnumHost.DASHBOARD:
        console.log(`Dashboard socket: ${ClientEnumHost.DASHBOARD}`)
        this.server.emit('online', this.usersOnline)
        break
      default:
        console.log('Unknown origin host')
    }
  }

  handleDisconnect(client: any) {
    const origin = client.handshake.headers.origin as ClientEnumHost
    const user = client.handshake.auth

    switch (origin) {
      case ClientEnumHost.CLIENT:
        if (user?.userId) {
          this.usersOnline = this.usersOnline.filter(
            (u) => u.userId !== user.userId,
          )
          console.log(`User ${user.userId} is OFFLINE`)
        }
      case ClientEnumHost.DASHBOARD:
        this.server.emit('online', this.usersOnline)
        break

      default:
        console.log('Unknown origin host')
    }
  }
}
