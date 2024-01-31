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
import { ProductsAdditionalDTO } from './dto/products.addtional.dto'
import { AdditionalInformationService } from './products.additional.service'

@Controller('additional_information')
export class AdditionalInformationController {
  constructor(
    private readonly additionalService: AdditionalInformationService,
  ) {}

  @Post(':productId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ProductsAdditionalDTO,
  ) {
    return await this.additionalService.create(productId, dto)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductsAdditionalDTO,
  ) {
    return await this.additionalService.update(id, dto)
  }
}
