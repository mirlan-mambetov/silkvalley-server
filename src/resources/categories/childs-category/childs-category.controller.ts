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
import { ChildsCategoryService } from './childs-category.service'

@Controller('childs-category')
export class ChildsCategoryController {
  constructor(private readonly childsCategoryService: ChildsCategoryService) {}

  @Post(':categoryId')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: CreateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.create(categoryId, dto)
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.update(id, dto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.findById(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.delete(id)
  }
}
