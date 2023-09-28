import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products/products.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  imports: [ProductsModule],
})
export class UserModule {}
