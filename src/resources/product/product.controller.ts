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
import { CreateProductDTO } from './data-transfer/create.data.transfer'
import { UpdateProductDTO } from './data-transfer/update.data.transfer'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   *
   * @param dto
   * @returns
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateProductDTO) {
    return await this.productService.create(dto)
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
    @Body() dto: UpdateProductDTO,
  ) {
    return await this.productService.update(id, dto)
  }

  /**
   *
   * @param alias
   * @returns
   */
  @Get(':alias')
  @HttpCode(HttpStatus.OK)
  async findOneByAlias(@Param('alias') alias: string) {
    return await this.productService.findOneByAlias(alias)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOneById(id)
  }

  /**
   *
   * @returns
   */
  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.productService.findAll()
  }

  /**
   *
   * @returns
   */
  @Get('similar/:id')
  @HttpCode(HttpStatus.OK)
  async findSimilar() {
    return await this.productService.findSimilar()
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.delete(id)
  }
}
