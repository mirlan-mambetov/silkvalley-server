import { Controller, Get, Render } from '@nestjs/common'
import { ProductsService } from './resource/products/products.service'

@Controller('/')
export class AppController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @Render('pages/home/index')
  async root() {
    const products = await this.productService.getAllProducts()
    return {
      message: 'Welcom to Silk Valley API',
      title: 'Home Page',
      total: products.length,
    }
  }
}
