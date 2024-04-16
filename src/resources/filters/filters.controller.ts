import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common'
import { QueryDTO } from '../data-transfer/query.dto'
import { FiltersService } from './filters.service'

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('category/product/attributes/:slug')
  @HttpCode(HttpStatus.OK)
  async findProductAttributes(@Param('slug') slug: string) {
    return await this.filtersService.productAttributes(slug)
  }

  @Get('product/filter')
  @HttpCode(HttpStatus.OK)
  async filteredProducts(@Query() queries: QueryDTO) {
    return await this.filtersService.filterdProducts(queries)
  }
}
