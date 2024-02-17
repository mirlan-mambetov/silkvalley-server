import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { MainCategoryController } from './main.category.controller'
import { MainCategoryService } from './main.category.service'

@Module({
  controllers: [MainCategoryController],
  providers: [
    PrismaService,
    MainCategoryService,
    ProductService,
    UploadService,
  ],
})
export class MainCategoryModule {}
