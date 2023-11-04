import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryModule } from 'src/resource/category/category.module'
import { PaginationService } from 'src/resource/pagination/pagination.service'
import { ProductsBrandService } from '../products-brand/products.brand.service'
import { ProductsModule } from '../products.module'
import { ProductsService } from '../products.service'
import { ProductsAttributesController } from './products-attributes.controller'
import { ProductsAttributesService } from './products-attributes.service'

@Module({
  controllers: [ProductsAttributesController],
  providers: [
    ProductsAttributesService,
    ProductsService,
    PrismaService,
    PaginationService,
    ProductsBrandService,
  ],
  imports: [ProductsModule, CategoryModule],
})
export class ProductsAttributesModule {}
