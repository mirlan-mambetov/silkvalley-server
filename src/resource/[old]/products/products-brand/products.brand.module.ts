import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryService } from 'src/resource/category/category.service'
import { PaginationService } from 'src/resource/pagination/pagination.service'
import { ProductsService } from '../products.service'
import { ProductsBrandController } from './products.brand.controller'
import { ProductsBrandService } from './products.brand.service'

@Module({
  controllers: [ProductsBrandController],
  providers: [
    ProductsBrandService,
    PrismaService,
    ProductsService,
    CategoryService,
    PaginationService,
  ],
  imports: [],
  exports: [ProductsBrandService],
})
export class ProductsBrandModule {}
