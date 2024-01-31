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
import { ProductBrandDTO } from './dto/product.brand.dto'
import { ProductsBrandService } from './products.brand.service'

@Controller('products-brand')
export class ProductsBrandController {
  constructor(private readonly productBrandService: ProductsBrandService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllBrands() {
    return await this.productBrandService.findAllBrands()
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ProductBrandDTO) {
    return await this.productBrandService.create(dto)
  }
}
