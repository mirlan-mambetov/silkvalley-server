import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductSpecificationService } from '../product.specification/product.specification.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { ProductAttributeController } from './product.attribute.controller'
import { ProductAttributeService } from './product.attribute.service'

@Module({
  controllers: [ProductAttributeController],
  providers: [
    ProductService,
    PrismaService,
    UploadService,
    ProductAttributeService,
    ProductSpecificationService,
  ],
})
export class ProductAttributeModule {}
