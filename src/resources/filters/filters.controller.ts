import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { QueryDTO } from '../data-transfer/query.dto'
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

  @Get('filtered')
  @HttpCode(HttpStatus.OK)
  async filteredProducts(@Query() queries: QueryDTO) {
    return await this.filtersService.filterProducts(queries)
  }
}
