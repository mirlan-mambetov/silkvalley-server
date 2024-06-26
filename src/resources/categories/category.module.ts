import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { FilterService } from '../filters/filters.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  controllers: [CategoryController],
  providers: [
    PrismaService,
    CategoryService,
    ProductService,
    UploadService,
    FilterService,
    JwtService,
  ],
})
export class CategoryModule {}
