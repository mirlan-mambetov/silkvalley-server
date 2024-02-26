import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma.service'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.contoller'
import { AuthService } from './auth.service'
import { jwtConfigOptions } from './config/jwt.config'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfigOptions()),
    forwardRef(() => UserModule),
  ],
  exports: [AuthService],
})
export class AuthModule {}
