import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { NotificationService } from '../notification/notification.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { UserService } from '../user/user.service'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    NotificationService,
    UserService,
    UploadService,
    ProductService,
    AuthService,
    JwtService,
  ],
})
export class OrderModule {}
