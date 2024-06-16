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
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateAttributeDTO } from './data-transfer/create.data.transfer'
import { IUpdateAttributeDTO } from './data-transfer/update.data.transfer'
import { ProductAttributeService } from './product.attribute.service'

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  /**
   *
   * @param ProductId
   * @param dto
   * @returns
   */
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateAttributeDTO,
  ) {
    return await this.productAttributeService.create(productId, dto)
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IUpdateAttributeDTO,
  ) {
    return await this.productAttributeService.update(id, dto)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productAttributeService.findById(id)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productAttributeService.deleteOne(id)
  }
}
