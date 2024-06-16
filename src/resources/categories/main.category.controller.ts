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
import { CreateMainCategoryDTO } from './data-transfer/create.main-category.dto'
import { UpdateMainCategoryDTO } from './data-transfer/update.main-category.dto'
import { MainCategoryService } from './main.category.service'

@Controller('main-category')
export class MainCategoryController {
  constructor(private readonly mainCategoryService: MainCategoryService) {}

  /**
   *
   * @param dto
   * @returns Message
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async create(@Body() dto: CreateMainCategoryDTO) {
    return await this.mainCategoryService.create(dto)
  }

  /**
   *
   * @param id
   * @param dto
   * @path dynamicly :id
   * @returns Message
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(['ADMIN', 'OWNER'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMainCategoryDTO,
  ) {
    return await this.mainCategoryService.update(id, dto)
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
    return await this.mainCategoryService.findOneBySlug(slug)
  }

  /**
   *
   * @param name
   * @returns Category
   * @path dynamicly by-name/:name
   */
  @Get('by-name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string) {
    return await this.mainCategoryService.findOneByName(name)
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
    return await this.mainCategoryService.findOneById(id)
  }

  /**
   *
   * @returns Categories
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.mainCategoryService.findAll()
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
    return await this.mainCategoryService.delete(id)
  }
}
