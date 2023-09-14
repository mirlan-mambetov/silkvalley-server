import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products.module'
import { ProductsService } from '../products.service'
import { ProductsImagesController } from './products-images.controller'
import { ProductsImagesService } from './products-images.service'

@Module({
  controllers: [ProductsImagesController],
  providers: [ProductsImagesService, ProductsService, PrismaService],
  imports: [ProductsModule],
})
export class ProductsImagesModule {}
