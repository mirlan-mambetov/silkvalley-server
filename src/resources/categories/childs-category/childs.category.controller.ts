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
import { CreateChildCategoryDTO } from '../data-transfer/create-childs.dto'
import { UpdateChildCategoryDTO } from '../data-transfer/update-childs.dto'
import { ChildsCategoryService } from './childs.category.service'

@Controller('childs-category')
export class ChildsCategoryController {
  constructor(private readonly childsCategoryService: ChildsCategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  // @Auth('SUPERUSER')
  async findAll() {
    return await this.childsCategoryService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // @Auth('SUPERUSER')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.findById(id)
  }

  @Get('by-alias/:alias')
  @HttpCode(HttpStatus.OK)
  // @Auth('SUPERUSER')
  async findByAlias(@Param('alias') alias: string) {
    return await this.childsCategoryService.findByAlias(alias)
  }

  @Get('by-parent-id/:id')
  @HttpCode(HttpStatus.OK)
  // @Auth('SUPERUSER')
  async findByParentId(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.findByParentId(id)
  }

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  // @Auth('SUPERUSER')
  async create(
    @Param('id', ParseIntPipe) parentId: number,
    @Body() dto: CreateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.create(parentId, dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  // @Auth('SUPERUSER')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  // @Auth('SUPERUSER')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.delete(id)
  }
}
