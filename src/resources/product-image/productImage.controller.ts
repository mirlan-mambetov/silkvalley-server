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
import { ProductImageService } from './ProductImage.service'
import { CreateProductImageDTO } from './data-transfer/create.data.transfer'
import { UpdateProductImageDTO } from './data-transfer/update.data.transfer'

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  /**
   *
   * @param productId
   * @param dto
   * @returns
   */
  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductImageDTO,
  ) {
    return await this.productImageService.create(productId, dto)
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductImageDTO,
  ) {
    return await this.productImageService.update(id, dto)
  }

  /**
   *
   * @param productId
   * @returns
   */
  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productImageService.findImageByProductId(productId)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productImageService.findImageById(id)
  }

  /**
   *
   * @returns
   */
  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAllImages() {
    return await this.productImageService.findAllImages()
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productImageService.deleteOne(id)
  }
}
