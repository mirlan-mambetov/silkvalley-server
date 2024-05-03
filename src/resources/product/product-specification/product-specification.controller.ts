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
import { SpecificationDTO, SpecificationUpdateDTO } from './data-transfer'
import { ProductSpecificationService } from './product-specification.sevice'

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SpecificationDTO[],
  ) {
    return await this.productSpecificationService.create(id, dto)
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: SpecificationUpdateDTO[]) {
    return await this.productSpecificationService.update(dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.productSpecificationService.findAll()
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productSpecificationService.findById(id)
  }

  @Get('by-product/:id')
  @HttpCode(HttpStatus.OK)
  async findByProductId(@Param('id', ParseIntPipe) productId: number) {
    return await this.productSpecificationService.findByProductId(productId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productSpecificationService.delete(id)
  }
}
