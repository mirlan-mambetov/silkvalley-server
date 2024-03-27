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
import { ChildsCategoryService } from './second-category.service'

@Controller('childs-category')
export class ChildsCategoryController {
  constructor(private readonly childsCategoryService: ChildsCategoryService) {}

  /**
   *
   * @param categoryId
   * @param dto
   * @returns
   */
  @Post(':categoryId')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: CreateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.create(categoryId, dto)
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChildCategoryDTO,
  ) {
    return await this.childsCategoryService.update(id, dto)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get('by-category/:id')
  @HttpCode(HttpStatus.OK)
  async findByMainCategoryId(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.findByMainCategoryId(id)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.findById(id)
  }

  /**
   *
   * @returns
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.childsCategoryService.findAll()
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.childsCategoryService.delete(id)
  }
}
