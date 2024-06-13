import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { ApiNotFoundMiddleware } from './middlewares/NotFound.middleware'
import { PrismaService } from './prisma.service'
import { AuthModule } from './resources/auth/auth.module'
import { ChildsCategoryModule } from './resources/categories/childs-category/childs.category.module'
import { MainCategoryModule } from './resources/categories/main.category.module'
import { SecondCategoryModule } from './resources/categories/second-category/second-category.module'
import { FiltersModule } from './resources/filters/filters.module'
import { AppGateWayModule } from './resources/gateway/app.gateway.module'
import { NotificaitonModule } from './resources/notification/notification.module'
import { OrderModule } from './resources/orders/order.module'
import { PaymentModule } from './resources/payment/payment.module'
import { ProductAttributeModule } from './resources/product.attribute/product.attribute.module'
import { ProductSpecificationModule } from './resources/product/product-specification/product-specification.module'
import { ProductModule } from './resources/product/product.module'
import { PromotionModule } from './resources/promotion/promotion.module'
import { SmsModule } from './resources/sms/sms.module'
import { UploadModule } from './resources/upload/upload.module'
import { UserModule } from './resources/user/user.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'live.smtp.mailtrap.io',
    //     port: 587,
    //     auth: {
    //       user: 'api',
    //       pass: '6bea5a14cccd5ff7040507d36a084584',
    //     },
    //   },
    //   defaults: {
    //     from: 'Silk Valley.',
    //   },
    //   template: {
    //     // dir: __dirname + '/templates',
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    AppGateWayModule,
    SmsModule,
    PaymentModule,
    FiltersModule,
    ProductModule,
    ProductAttributeModule,
    ProductSpecificationModule,
    UploadModule,
    MainCategoryModule,
    SecondCategoryModule,
    AuthModule,
    UserModule,
    ChildsCategoryModule,
    OrderModule,
    NotificaitonModule,
    PromotionModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiNotFoundMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes('*')
  }
}
