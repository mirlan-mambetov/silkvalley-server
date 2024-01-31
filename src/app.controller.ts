import { Controller, Get, Render } from '@nestjs/common'

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  @Render('pages/home/index')
  async root() {
    // const products = await this.productService.getAllProducts()
    return {
      message: 'Welcom to Silk Valley API',
      title: 'Home Page',
      // total: products.length,
    }
  }
}
