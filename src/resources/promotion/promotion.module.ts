import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
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
    UploadService,
    JwtService,
  ],
})
export class PromotionModule {}
