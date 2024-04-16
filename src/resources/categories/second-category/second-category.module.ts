import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FiltersService } from 'src/resources/filters/filters.service'
import { ProductService } from 'src/resources/product/product.service'
import { UploadService } from 'src/resources/upload/upload.service'
import { MainCategoryService } from '../main.category.service'
import { SecondCategoryController } from './second-category.controller'
import { SecondCategoryService } from './second-category.service'

@Module({
  controllers: [SecondCategoryController],
  providers: [
    SecondCategoryService,
    PrismaService,
    MainCategoryService,
    UploadService,
    ProductService,
    FiltersService,
  ],
})
export class SecondCategoryModule {}
