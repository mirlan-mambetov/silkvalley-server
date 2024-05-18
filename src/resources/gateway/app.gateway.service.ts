import { OnModuleInit } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { UserRoles } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { IBase } from 'src/interfaces/Base.interface'
import { OnlineUserService } from '../user/online-users/online.user.service'

enum ClientEnumHost {
  CLIENT = 'http://localhost:3000',
  DASHBOARD = 'http://localhost:3001',
}

interface IUserT {
  email: string
}
interface IOnlineUsers extends IBase {
  id: number
  createdAt: Date
  updatedAt: Date
  users: {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string
    email: string
    phoneNumber: string
    role: UserRoles[]
    isOnline: boolean
  }[]
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateWayService implements OnModuleInit {
  @WebSocketServer()
  server: Server

  private currentOnlineUsers: IOnlineUsers[]
  constructor(private readonly onlineUsers: OnlineUserService) {}

  async onModuleInit() {
    this.initializeSocketEventHandlers()
  }

  private initializeSocketEventHandlers() {
    this.server.on('connection', async (socket: Socket) => {
      const origin = socket?.handshake.headers.origin as ClientEnumHost
      switch (origin) {
        case ClientEnumHost.CLIENT:
          console.log(`Client socket: ${ClientEnumHost.CLIENT}`)
          return
        case ClientEnumHost.DASHBOARD:
          console.log(`Dashboard socket: ${ClientEnumHost.DASHBOARD}`)
          const users = await this.onlineUsers.getOnlineUsers()
          this.server.emit('online', { users })
          return
        default:
          return console.log(`Users not on online`)
      }
    })
  }

  @SubscribeMessage('logOut')
  async handleLogOutUser(
    @MessageBody() user: IUserT,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`OFFLINE ${user.email}`)
    await this.onlineUsers.setOfflineStatus(user.email)
    const users = await this.onlineUsers.getOnlineUsers()
    this.server.emit('online', {
      users,
    })
  }

  @SubscribeMessage('logIn')
  async handleLogInUser(
    @MessageBody() user: IUserT,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`ONLINE ${user.email}`)
    await this.onlineUsers.setOnline(user.email)
    const users = await this.onlineUsers.getOnlineUsers()
    this.server.emit('online', {
      users,
      message: `${user.email} в сети`,
    })
  }
}
