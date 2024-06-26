import { MailerModule } from '@nestjs-modules/mailer'
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
import { AuthModule } from './resources/auth/auth.module'
import { CategoryModule } from './resources/categories/category.module'
import { FilterModule } from './resources/filters/filters.module'
import { AppGateWayModule } from './resources/gateway/app.gateway.module'
import { NotificaitonModule } from './resources/notification/notification.module'
import { OrderModule } from './resources/orders/order.module'
import { PaymentModule } from './resources/payment/payment.module'
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
    MailerModule.forRoot({
      transport: {
        host: 'srv536935.hstgr.cloud',
        port: 465,
        secure: true,
        auth: {
          user: 'root',
          pass: 'Mambetovmn1995#',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'hello@slkvalley.com',
      },
    }),
    AppGateWayModule,
    SmsModule,
    PaymentModule,
    FilterModule,
    ProductModule,
    UploadModule,
    CategoryModule,
    AuthModule,
    UserModule,
    OrderModule,
    NotificaitonModule,
    PromotionModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiNotFoundMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes('*')
  }
}
// {SHA512-CRYPT}$6$IBaZksJ4S6GphKDO$bZQGBS1Vvr7pbKivWUtgywCpVHY3Ny6oAH8Xr56Lqo9/ppaU1Vfxf8CAg85aEwY8g.cFvfgpP/U.R2lu7AquN0
