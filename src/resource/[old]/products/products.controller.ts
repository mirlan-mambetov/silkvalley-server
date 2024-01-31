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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { EnumProductType } from '@prisma/client'
import { Auth } from '../auth/decarators/auth.decarator'
import { CurrentUser } from '../user/decarators/current.user'
import { CreateProductDTO } from './dto/create.product.dto'
import { FiltersDto } from './dto/filters.dto'
import { UpdateProductDTO } from './dto/update.product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts(@Query() queryDto: FiltersDto) {
    return await this.productsService.getAllProducts(queryDto.searchTerm)
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
    return await this.productsService.getProductsByType(EnumProductType.WOMAN)
  }

  @Get('for-mans')
  @HttpCode(HttpStatus.OK)
  async getForMans() {
    return await this.productsService.getProductsByType(EnumProductType.MAN)
  }

  // GET PRODUCT BY SLUG
  @Get('by-category')
  @HttpCode(HttpStatus.OK)
  async getProductByCategory(@Query() queryDto: FiltersDto) {
    return await this.productsService.getProductsByCategory(queryDto)
  }

  // GET PRODUCT BY BRAND ID
  @Get('by-brand/:id')
  @HttpCode(HttpStatus.OK)
  async getProductByBrand(@Param('id', ParseIntPipe) brandId: number) {
    return await this.productsService.getProductsByBrand(brandId)
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

  // SET RATING
  @Post('rating')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async setRatingToProduct(
    @CurrentUser('id') userId: number,
    @Body() dto: { rating: number; productId: number },
  ) {
    return await this.productsService.setRatingToProduct(
      userId,
      dto.productId,
      dto.rating,
    )
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