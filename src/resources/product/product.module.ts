import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { FilterService } from '../filters/filters.service'
import { UploadService } from '../upload/upload.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    UploadService,
    FilterService,
    JwtService,
  ],
})
export class ProductModule {}
