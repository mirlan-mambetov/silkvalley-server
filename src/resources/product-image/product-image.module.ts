import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { ProductImageService } from './Product-image-service'
import { ProductImageController } from './product-image-controller'

@Module({
  controllers: [ProductImageController],
  providers: [
    PrismaService,
    ProductImageService,
    ProductService,
    UploadService,
  ],
})
export class ProductImageModule {}
