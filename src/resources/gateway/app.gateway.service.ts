import { OnModuleInit } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { IUser } from 'src/interfaces/user.interface'
import { UserService } from '../user/user.service'

enum ClientEnumHost {
  CLIENT = 'http://localhost:3000',
  DASHBOARD = 'http://localhost:3001',
}

interface IUserRequest extends IUser {
  isOnline: boolean
}
interface IUserT {
  email: string
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateWayService implements OnModuleInit {
  @WebSocketServer()
  server: Server

  private currentUsers: IUserT[] = []

  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    this.initializeSocketEventHandlers()
  }

  private async initializeSocketEventHandlers() {
    this.server.on('connection', (socket: Socket) => {
      const origin = socket?.handshake.headers.origin as ClientEnumHost
      switch (origin) {
        case ClientEnumHost.CLIENT:
          const user = socket?.handshake.auth as IUserT
          console.log(`Client queries: ${ClientEnumHost.CLIENT}`)
          if (user) {
            if (
              !this.currentUsers.some(
                (currentUser) => currentUser.email === user.email,
              )
            ) {
              this.currentUsers.push({ email: user.email })
            }
            console.log(this.currentUsers)
          }
          return
        case ClientEnumHost.DASHBOARD:
          this.server.emit('online', this.currentUsers)
          console.log(
            `Current Users length ${Object.keys(this.currentUsers.length)}`,
          )
          console.log(`Dashboard queries: ${ClientEnumHost.DASHBOARD}`)
          return
        default:
          return console.log(`Users not on online`)
      }
    })
  }

  @SubscribeMessage('logOut')
  handleLogOutUser(
    @MessageBody() user: IUserT,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`User ${user.email} is Offline`)

    this.currentUsers = this.currentUsers.filter(
      (item) => item.email !== user.email,
    )
    this.server.emit('online', this.currentUsers)
  }

  @SubscribeMessage('logIn')
  handleLogInUser(
    @MessageBody() user: IUserT,
    @ConnectedSocket() socket: Socket,
  ) {
    if (user.email) {
      console.log(`User ${user.email} is Online`)
      if (
        !this.currentUsers.some(
          (currentUser) => currentUser.email === user.email,
        )
      ) {
        this.currentUsers.push({ email: user.email })
      }
    }
    this.server.emit('online', this.currentUsers)
  }
}
