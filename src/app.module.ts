import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
// import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { NotFoundExceptionFilter } from './filters/NotFound.filters'
import { PrismaService } from './prisma.service'
import { AuthModule } from './resource/auth/auth.module'
import { CategoryModule } from './resource/category/category.module'
import { PaginationModule } from './resource/pagination/pagination.module'
import { AdditionalInformationModule } from './resource/products/products-additional/products.additional.module'
import { ProductsAttributesModule } from './resource/products/products-attributes/products-attributes.module'
import { ProductsDimensionsModule } from './resource/products/products-dimensions/products.dimensions.module'
import { ProductsImagesModule } from './resource/products/products-images/products-images.module'
import { ProductsModule } from './resource/products/products.module'
import { UserModule } from './resource/user/user.module'

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    ConfigModule.forRoot(),
    AdditionalInformationModule,
    ProductsDimensionsModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductsModule,
    ProductsImagesModule,
    ProductsAttributesModule,
    PaginationModule,
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
