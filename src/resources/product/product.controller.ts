import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateProductDto } from './data-transfer/create.data.transfer'
import { CreateProductVariantDto } from './data-transfer/product-variant.dto'
import { UpdateProductVariantDto } from './data-transfer/product-variant.update.dto'
import { UpdateProductDto } from './data-transfer/update.data.transfer'
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
  // @Auth(['ADMIN', 'OWNER'])
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto)
  }

  @Post('variant')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  // @Auth(['ADMIN', 'OWNER'])
  async createVariant(@Body() dto: CreateProductVariantDto) {
    return await this.productService.createProductVariant(dto)
  }

  @Patch('variant/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  // @Auth(['ADMIN', 'OWNER'])
  async updateVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return await this.productService.updateProductVariant(id, dto)
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(id, dto)
  }

  /**
   *
   * @param alias
   * @returns
   */
  @Get('by-alias/:alias')
  @HttpCode(HttpStatus.OK)
  async findOneByAlias(@Param('alias') alias: string) {
    return await this.productService.findOneByAlias(alias)
  }

  /**
   *
   * @param slug
   * @returns
   * @deprecated This method is deprecated on api/v2
   */
  @Get('by-category')
  @HttpCode(HttpStatus.OK)
  async findByCategorySlug(
    @Query()
    {
      mainCategorySlug,
      secondCategorySlug,
    }: {
      mainCategorySlug: string
      secondCategorySlug: string
    },
  ) {
    return await this.productService.findByCategorySlug(
      mainCategorySlug,
      secondCategorySlug,
    )
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
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.productService.getAllProducts()
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
  @Auth(['ADMIN', 'OWNER'])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.delete(id)
  }
}
