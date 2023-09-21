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
import { CategoryService } from './category.service'
import { CategoryDTO, ProductCategoryDTO } from './dto/category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @returns Find all categories
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllCategories() {
    return await this.categoryService.findAllCategories()
  }

  /**
   * @returns Find all Product categories
   */
  @Get('product-category')
  @HttpCode(HttpStatus.OK)
  async findAllProductCategories() {
    return await this.categoryService.findAllProductCategories()
  }

  /**
   * @returns Find category id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findById(id)
  }

  /**
   * @param dto
   * @returns Main category
   * @description create main category
   */
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createMainCategory(@Body() dto: CategoryDTO) {
    return await this.categoryService.createMainCategory(dto)
  }

  /**
   * @param categoryId
   * @param dto
   * @returns  Category
   * @description create product category
   */
  @Post('product-category')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createProductCategory(@Body() dto: ProductCategoryDTO) {
    return await this.categoryService.createProductCategory(dto)
  }

  /**
   * @param id
   * @param dto
   * @description update product category
   */
  @Put('product-category/:categoryId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateProductCategory(
    @Param('categoryId', ParseIntPipe) id: number,
    @Body() dto: ProductCategoryDTO,
  ) {
    return await this.categoryService.updateProductCategory(id, dto)
  }

  /**
   * @param id
   * @description delete product category
   */
  @Delete('product-category/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProductCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteProductCategory(id)
  }
}
