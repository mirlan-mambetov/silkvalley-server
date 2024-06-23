import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common'
import { QueryDTO } from '../data-transfer/query.dto'
import { FilterService } from './filters.service'

@Controller('filter')
export class FilterController {
  constructor(private readonly filtersService: FilterService) {}

  @Get('attributes')
  @HttpCode(HttpStatus.OK)
  async findProductAttributes(@Param('slug') slug: string) {
    return await this.filtersService.productAttributes(slug)
  }

  @Get('product/filter')
  @HttpCode(HttpStatus.OK)
  async filteredProducts(@Query() queries: QueryDTO) {
    return await this.filtersService.filterProducts(queries)
  }
}
