import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { QueryFilterDTO } from '../data-transfer/query.dto'
import { IFilterDTO } from './data-transfer'
import { FilterService } from './filters.service'

@Controller('filter')
export class FilterController {
  constructor(private readonly filtersService: FilterService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findProductAttributes(@Query() query: IFilterDTO) {
    return await this.filtersService.productAttributes(query)
  }

  @Post('attributes')
  @HttpCode(HttpStatus.OK)
  findVariantAttributes(@Body() dto: { id: string }) {
    return this.filtersService.findVariantAttributes(+dto.id)
  }

  @Get('filtered')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async filteredProducts(@Query() queries: QueryFilterDTO) {
    return await this.filtersService.filterProducts(queries)
  }
}
