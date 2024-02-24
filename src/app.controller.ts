import { Controller, Get, Render, UseFilters } from '@nestjs/common'
import { NotFoundExceptionFilter } from './filters/NotFound.filters'

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  @Render('pages/home/index')
  @UseFilters(NotFoundExceptionFilter)
  async root() {
    // const products = await this.productService.getAllProducts()
    return {
      message: 'Welcom to Silk Valley API',
      title: 'Home Page',
      // total: products.length,
    }
  }
}
