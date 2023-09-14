import { Controller, Get, Render } from '@nestjs/common'

@Controller('/')
export class AppController {
  @Get()
  @Render('pages/home/index')
  root() {
    return { message: 'Welcom to Silk Valley API', title: 'Home Page' }
  }
}
