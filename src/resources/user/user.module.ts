import { Module, forwardRef } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
