import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryModule } from 'src/resource/category/category.module'
import { PaginationService } from 'src/resource/pagination/pagination.service'
import { UserService } from 'src/resource/user/user.service'
import { ProductsAttributesModule } from '../products-attributes/products-attributes.module'
import { ProductsBrandService } from '../products-brand/products.brand.service'
import { ProductsImagesModule } from '../products-images/products-images.module'
import { ProductsModule } from '../products.module'
import { ProductsService } from '../products.service'
import { ProductReviewsController } from './product.reviews.controller'
import { ProductReviewsService } from './product.reviews.service'

@Module({
  controllers: [ProductReviewsController],
  providers: [
    ProductReviewsService,
    PrismaService,
    ProductsService,
    PaginationService,
    UserService,
    ProductsBrandService,
  ],
  imports: [
    ProductsModule,
    ProductsImagesModule,
    ProductsAttributesModule,
    CategoryModule,
  ],
})
export class ProductsReviewsModule {}
