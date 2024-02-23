import {
  Controller,
  Get,
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

  /**
   *
   * @param productId
   * @returns
   */
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id', ParseIntPipe) productId: number) {
    return await this.productSpecificationService.create(productId)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productSpecificationService.findById(id)
  }
}
