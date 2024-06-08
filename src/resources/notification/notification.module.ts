import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { UserService } from '../user/user.service'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [],
  providers: [
    NotificationService,
    PrismaService,
    AuthService,
    UserService,
    JwtService,
    UploadService,
    ProductService,
  ],
  controllers: [NotificationController],
})
export class NotificaitonModule {}
