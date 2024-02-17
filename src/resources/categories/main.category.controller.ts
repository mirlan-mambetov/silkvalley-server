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
import { CreateMainCategoryDTO } from './data-transfer/create.main-category.dto'
import { UpdateMainCategoryDTO } from './data-transfer/update.main-category.dto'
import { MainCategoryService } from './main.category.service'

@Controller('main-category')
export class MainCategoryController {
  constructor(private readonly mainCategoryService: MainCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateMainCategoryDTO) {
    return await this.mainCategoryService.create(dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMainCategoryDTO,
  ) {
    return await this.mainCategoryService.update(id, dto)
  }

  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.mainCategoryService.findOneBySlug(slug)
  }

  @Get('by-name/:name')
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('name') name: string) {
    return await this.mainCategoryService.findOneByName(name)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.mainCategoryService.findOneById(id)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.mainCategoryService.findAll()
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.mainCategoryService.delete(id)
  }
}
