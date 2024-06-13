import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductAttributeService } from '../product.attribute/product.attribute.service'
import { ProductSpecificationService } from '../product/product-specification/product-specification.sevice'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { PromotionController } from './promotion.controller'
import { PromotionService } from './promotion.service'

@Module({
  imports: [],
  controllers: [PromotionController],
  providers: [
    PromotionService,
    PrismaService,
    ProductService,
    ProductAttributeService,
    ProductSpecificationService,
    UploadService,
  ],
})
export class PromotionModule {}
