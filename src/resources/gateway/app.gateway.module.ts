import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { OnlineUserService } from '../user/online-users/online.user.service'
import { UserService } from '../user/user.service'
import { AppGateWayService } from './app.gateway.service'

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppGateWayService,
    OnlineUserService,
    UserService,
    JwtService,
    AuthService,
    PrismaService,
  ],
})
export class AppGateWayModule {}
