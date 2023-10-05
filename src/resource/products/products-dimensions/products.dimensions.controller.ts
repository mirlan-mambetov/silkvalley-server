import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { productDimensionsDTO } from './dto/product.dimensions.dto'
import { ProductsDimensionsService } from './products.dimensions.service'

@Controller('products-dimensions')
export class ProductsDimensionsController {
  constructor(
    private readonly productDimensionsService: ProductsDimensionsService,
  ) {}

  @Post(':productId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: productDimensionsDTO,
  ) {
    return await this.productDimensionsService.create(productId, dto)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: productDimensionsDTO,
  ) {
    return await this.productDimensionsService.update(id, dto)
  }
}
