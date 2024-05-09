import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { FiltersController } from './filters.controller'
import { FiltersService } from './filters.service'

@Module({
  imports: [],
  providers: [FiltersService, PrismaService, ProductService, UploadService],
  controllers: [FiltersController],
})
export class FiltersModule {}
