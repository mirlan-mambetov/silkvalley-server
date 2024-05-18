import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from 'src/resources/auth/auth.service'
import { UserService } from '../user.service'
import { OnlineUserService } from './online.user.service'

@Module({
  imports: [],
  controllers: [],
  providers: [
    OnlineUserService,
    PrismaService,
    UserService,
    AuthService,
    JwtService,
  ],
})
export class OnlineUserModule {}
