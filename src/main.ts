import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as hbs from 'express-handlebars'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.engine(
    'hbs',
    hbs.engine({
      partialsDir: 'views/partials',
      defaultLayout: 'index',
      extname: 'hbs',
    }),
  )
  app.setViewEngine('hbs')
  app.setGlobalPrefix('api', { exclude: ['/'] })
  app.enableCors()
  await app.listen(5000)
}
bootstrap()
