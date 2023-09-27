import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products/products.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [ProductsModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
