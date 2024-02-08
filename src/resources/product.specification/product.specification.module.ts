import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { ProductSpecificationController } from './product.specification.controller'
import { ProductSpecificationService } from './product.specification.service'

@Module({
  controllers: [ProductSpecificationController],
  providers: [
    ProductService,
    PrismaService,
    UploadService,
    ProductSpecificationService,
  ],
})
export class ProductSpecificationModule {}
