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
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateProductDto } from './data-transfer/create.data.transfer'
import {
  CreateColorDTO,
  CreateProductVariantDto,
  CreateSpecificationDto,
  UpdateColorDTO,
  UpdateSpecificationDto,
} from './data-transfer/product-variant.dto'
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
  @Auth(['ADMIN', 'OWNER'])
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto)
  }

  @Post('variant')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async createVariant(@Body() dto: CreateProductVariantDto) {
    return await this.productService.createProductVariant(dto)
  }

  @Patch('variant/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async updateVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return await this.productService.updateProductVariant(id, dto)
  }

  @Post('variant/color')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async createColor(@Body() dto: CreateColorDTO) {
    return await this.productService.createColor(dto)
  }

  @Put('variant/color')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async updateColor(@Body() dto: UpdateColorDTO) {
    return await this.productService.updateColor(dto)
  }

  @Delete('variant/color/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async removeColorImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { path: string },
  ) {
    return await this.productService.removeColorImage(id, data.path)
  }

  @Get('variant/color/:id')
  @HttpCode(HttpStatus.OK)
  async findColorById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findColorById(id)
  }

  @Get('variant/specification/:id')
  @HttpCode(HttpStatus.OK)
  async findSpecificationByVariantId(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findSpecificationByVariantId(id)
  }

  @Post('variant/specification')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async createSpecification(@Body() dto: CreateSpecificationDto) {
    return await this.productService.createSpecifications(dto)
  }

  @Put('variant/specification')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async updateSpecification(@Body() dto: UpdateSpecificationDto) {
    return await this.productService.updateSpecifications(dto)
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
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findOneByAlias(@Param('slug') slug: string) {
    return await this.productService.findOneBySlug(slug)
  }

  @Get('variant/:id')
  @HttpCode(HttpStatus.OK)
  async findVariantById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findVariantById(id)
  }

  @Get('category/:slug')
  @HttpCode(HttpStatus.OK)
  async findOneByCategoryId(@Param('slug') slug: string) {
    return await this.productService.findByCategoryId(slug)
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
    return await this.productService.findAllProducts()
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

  // /**
  //  *
  //  * @param id
  //  * @returns
  //  */
  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // @Auth(['ADMIN', 'OWNER'])
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return await this.productService.delete(id)
  // }
}
