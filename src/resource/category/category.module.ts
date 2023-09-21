import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products/products.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  imports: [ProductsModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
