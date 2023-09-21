import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
// import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from './app.controller'
import { NotFoundExceptionFilter } from './filters/NotFound.filters'
import { PrismaService } from './prisma.service'
import { CategoryModule } from './resource/category/category.module'
import { ProductsAttributesModule } from './resource/products/products-attributes/products-attributes.module'
import { ProductsImagesModule } from './resource/products/products-images/products-images.module'
import { ProductsModule } from './resource/products/products.module'

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    CategoryModule,
    ProductsModule,
    ProductsImagesModule,
    ProductsAttributesModule,
  ],
  controllers: [AppController],

  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
