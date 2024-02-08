import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { ProductSpecificationService } from './product.specification.service'

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id', ParseIntPipe) productId: number) {
    return await this.productSpecificationService.create(productId)
  }
}
