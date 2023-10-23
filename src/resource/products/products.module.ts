import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryModule } from '../category/category.module'
import { CategoryService } from '../category/category.service'
import { PaginationService } from '../pagination/pagination.service'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    CategoryService,
    PaginationService,
  ],
  exports: [ProductsService],
  imports: [CategoryModule],
})
export class ProductsModule {}
