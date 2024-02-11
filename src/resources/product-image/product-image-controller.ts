import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ProductImageService } from './Product-image-service'
import { CreateProductImageDTO } from './data-transfer/create.data.transfer'
import { UpdateProductImageDTO } from './data-transfer/update.data.transfer'

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductImageDTO,
  ) {
    return await this.productImageService.create(productId, dto)
  }
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductImageDTO,
  ) {
    return await this.productImageService.update(id, dto)
  }

  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productImageService.findImageByProductId(productId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productImageService.findImageById(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAllImages() {
    return await this.productImageService.findAllImages()
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productImageService.deleteOne(id)
  }
}
