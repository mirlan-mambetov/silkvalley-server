import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products.module'
import { ProductsDimensionsController } from './products.dimensions.controller'
import { ProductsDimensionsService } from './products.dimensions.service'

@Module({
  imports: [ProductsModule],
  providers: [ProductsDimensionsService, PrismaService],
  controllers: [ProductsDimensionsController],
})
export class ProductsDimensionsModule {}
