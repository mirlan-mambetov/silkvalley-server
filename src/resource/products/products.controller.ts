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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateProductDTO } from './dto/create.product.dto'
import { UpdateProductDTO } from './dto/update.product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return await this.productsService.getAllProducts()
  }

  // GET PRODUCT BY SLUG
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async getPopular() {
    return await this.productsService.getPopularProducts()
  }

  // GET PRODUCT BY SLUG
  @Get('exclusive')
  @HttpCode(HttpStatus.OK)
  async getExclusive() {
    return await this.productsService.getExclusiveProducts()
  }

  @Get('for-womans')
  @HttpCode(HttpStatus.OK)
  async getForWomans() {
    return await this.productsService.getForWomans()
  }

  // GET PRODUCT BY SLUG
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  async getProductBySlug(@Param('slug') slug: string) {
    return await this.productsService.getProductBySlug(slug)
  }

  // GET SIMILAR PRODUCTS
  @Get('similar/:id')
  @HttpCode(HttpStatus.OK)
  async getSimilarProducts(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getSimilar(id)
  }

  // GET PRODUCT BY ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getProducById(id)
  }

  // CREATE PRODUCT
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() dto: CreateProductDTO) {
    return await this.productsService.createProduct(dto)
  }

  // UPDATE PRODUCT
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDTO,
  ) {
    return await this.productsService.updateProduct(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deleteProduct(id)
  }
}
