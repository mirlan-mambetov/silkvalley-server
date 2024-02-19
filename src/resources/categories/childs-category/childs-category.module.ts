import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/resources/product/product.service'
import { UploadService } from 'src/resources/upload/upload.service'
import { MainCategoryService } from '../main.category.service'
import { ChildsCategoryController } from './childs-category.controller'
import { ChildsCategoryService } from './childs-category.service'

@Module({
  controllers: [ChildsCategoryController],
  providers: [
    ChildsCategoryService,
    PrismaService,
    MainCategoryService,
    UploadService,
    ProductService,
  ],
})
export class ChildsCategoryModule {}