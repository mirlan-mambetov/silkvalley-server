import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateProductDTO } from './dto/create.product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return await this.productsService.getAllProducts()
  }

  // CREATE PRODUCT
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() dto: CreateProductDTO) {
    return await this.productsService.createProduct(dto)
  }
}
