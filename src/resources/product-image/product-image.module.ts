import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FiltersService } from '../filters/filters.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { ProductImageService } from './ProductImage.service'
import { ProductImageController } from './productImage.controller'

@Module({
  controllers: [ProductImageController],
  providers: [
    PrismaService,
    ProductImageService,
    ProductService,
    UploadService,
    FiltersService,
  ],
})
export class ProductImageModule {}
