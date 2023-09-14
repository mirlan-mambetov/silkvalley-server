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
import { CreateProductAttributesDto } from '../dto/create.productAttributes.dto'
import { ProductsAttributesService } from './products-attributes.service'

@Controller('products-attributes')
export class ProductsAttributesController {
  constructor(
    private readonly productsAttributesService: ProductsAttributesService,
  ) {}

  // CREATE PRODUCT ATTRIBUTES
  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductAttributesDto,
  ) {
    return await this.productsAttributesService.create(productId, dto)
  }

  // UPDATE PRODUCT ATTRIBUTES
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductAttributesDto,
  ) {
    return await this.productsAttributesService.update(id, dto)
  }
}
