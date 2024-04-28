import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UploadService } from 'src/resources/upload/upload.service'
import { ProductService } from '../product.service'
import { ProductSpecificationController } from './product-specification.controller'
import { ProductSpecificationService } from './product-specification.sevice'

@Module({
  imports: [],
  controllers: [ProductSpecificationController],
  providers: [
    ProductSpecificationService,
    PrismaService,
    ProductService,
    UploadService,
  ],
})
export class ProductSpecificationModule {}
