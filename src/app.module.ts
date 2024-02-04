import { Module } from '@nestjs/common'
// import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { PrismaService } from './prisma.service'
import { ProductAttributeModule } from './resources/product.attribute/product.attribute.module'
import { ProductSpecificationModule } from './resources/product.specification/product.specification.module'
import { ProductModule } from './resources/product/product.module'
import { UploadModule } from './resources/upload/upload.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot(),
    ProductModule,
    ProductSpecificationModule,
    ProductAttributeModule,
    UploadModule,
  ],
  controllers: [AppController],

  providers: [PrismaService],
})
export class AppModule {}
