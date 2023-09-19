import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { CreateProductImagesDto } from '../dto/create.productImages.dto'
import { ProductsImagesService } from './products-images.service'

@Controller('products-images')
export class ProductsImagesController {
  constructor(private readonly productsImagesService: ProductsImagesService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getImagesById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsImagesService.getById(id)
  }

  // CREATE PRODUCT IMAGES
  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId') productId: number,
    @Body() dto: CreateProductImagesDto,
  ) {
    return await this.productsImagesService.create(productId, dto)
  }

  // UPDATE
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductImagesDto,
  ) {
    return await this.productsImagesService.update(id, dto)
  }
}
