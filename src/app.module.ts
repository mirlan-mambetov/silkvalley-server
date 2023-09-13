import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ProductsAttributesModule } from './products/products-attributes/products-attributes.module'
import { ProductsImagesModule } from './products/products-images/products-images.module'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [ProductsModule, ProductsImagesModule, ProductsAttributesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
