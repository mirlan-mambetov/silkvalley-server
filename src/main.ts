import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import * as hbs from 'express-handlebars'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  })

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
  app.setGlobalPrefix('api/v1', { exclude: ['/'] })
  app.enableCors({
    origin: [
      'https://dashboard.slkvalley.com',
      'https://slkvalley.com',
      'https://preview.slkvalley.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    methods: 'GET,POST,PUT,PATCH,HEAD,DELETE',
    credentials: true,
  })
  app.use(cookieParser(process.env.COOKIE_SECRET))

  await app.listen(5000)
  console.log(`SERVER has been running on: ${await app.getUrl()}`)
}
bootstrap()
