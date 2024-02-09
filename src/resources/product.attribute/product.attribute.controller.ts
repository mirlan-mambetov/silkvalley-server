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
import { ICreateAttributeDTO } from './data-transfer/create.data.transfer'
import { IUpdateAttributeDTO } from './data-transfer/update.data.transfer'
import { ProductAttributeService } from './product.attribute.service'

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('id', ParseIntPipe) specificationId: number,
    @Body() dto: ICreateAttributeDTO,
  ) {
    return await this.productAttributeService.create(specificationId, dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IUpdateAttributeDTO[],
  ) {
    return await this.productAttributeService.update(id, dto)
  }
}
