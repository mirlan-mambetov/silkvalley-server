import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
// import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { ApiNotFoundMiddleware } from './middlewares/NotFound.middleware'
import { PrismaService } from './prisma.service'
import { AuthModule } from './resources/auth/auth.module'
import { ChildsCategoryModule } from './resources/categories/childs-category/childs-category.module'
import { MainCategoryModule } from './resources/categories/main.category.module'
import { ProductImageModule } from './resources/product-image/product-image.module'
import { ProductAttributeModule } from './resources/product.attribute/product.attribute.module'
import { ProductSpecificationModule } from './resources/product.specification/product.specification.module'
import { ProductModule } from './resources/product/product.module'
import { UploadModule } from './resources/upload/upload.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot(),
    ProductModule,
    ProductSpecificationModule,
    ProductAttributeModule,
    UploadModule,
    ProductImageModule,
    MainCategoryModule,
    ChildsCategoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiNotFoundMiddleware)
      .exclude({ path: '/api', method: RequestMethod.GET })
      .forRoutes('*')
  }
}
