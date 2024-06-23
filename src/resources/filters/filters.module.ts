import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { FilterController } from './filters.controller'
import { FilterService } from './filters.service'

@Module({
  imports: [],
  providers: [FilterService, PrismaService, ProductService, UploadService],
  controllers: [FilterController],
})
export class FilterModule {}
