import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  searchProducts(@Query('by') by: string) {
    return this.searchService.searchProducts(by)
  }
}
