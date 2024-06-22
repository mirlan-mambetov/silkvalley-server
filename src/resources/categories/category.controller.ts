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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CreateCategoryDTO, CreateChildDTO } from './dto/create.category.dto'
import { UpdateCategoryDTO } from './dto/update.category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   *
   * @param dto
   * @returns Message
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async create(@Body() dto: CreateCategoryDTO) {
    return await this.categoryService.create(dto)
  }

  /**
   *
   * @param dto
   * @returns Message
   */
  @Post('child')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async createChild(@Body() dto: CreateChildDTO) {
    return await this.categoryService.createChild(dto)
  }

  /**
   *
   * @param id
   * @param dto
   * @path dynamicly :id
   * @returns CATEGORY
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDTO,
  ) {
    return await this.categoryService.update(id, dto)
  }

  /**
   *
   * @returns Categories
   */
  @Get('parents')
  @HttpCode(HttpStatus.OK)
  async findParents() {
    return await this.categoryService.findParents()
  }

  /**
   *
   * @param slug
   * @path dynamicly by-slug/:id
   * @returns Category
   */
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoryService.findOneBySlug(slug)
  }

  /**
   *
   * @param id
   * @returns Category
   * @path dynamicly :id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOneById(id)
  }

  @Get('by-parent/:id')
  @HttpCode(HttpStatus.OK)
  async findChildsByParent(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findChildsByParent(id)
  }

  /**
   *
   * @returns Categories
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.categoryService.findAll()
  }

  /**
   *
   * @param id
   * @returns Message
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id)
  }
}
