import { Module } from '@nestjs/common';
import { ProductSpecificationService } from './product.specification.service';
import { ProductSpecificationController } from './product.specification.controller';

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService],
})
export class ProductSpecificationModule {}
