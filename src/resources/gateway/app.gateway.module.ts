import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { MailService } from '../mail/mail.service'
import { UserService } from '../user/user.service'
import { AppGateWayService } from './app.gateway.service'

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppGateWayService,
    UserService,
    JwtService,
    AuthService,
    PrismaService,
    MailService,
  ],
})
export class AppGateWayModule {}
