import { StripeModule } from '@golevelup/nestjs-stripe'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { MailService } from '../mail/mail.service'
import { NotificationService } from '../notification/notification.service'
import { ProductService } from '../product/product.service'
import { SmsService } from '../sms/sms.service'
import { UploadService } from '../upload/upload.service'
import { UserService } from '../user/user.service'
import { stripeConfig } from './config/stripe.config'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => stripeConfig(configService),
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    UserService,
    AuthService,
    JwtService,
    NotificationService,
    UploadService,
    ProductService,
    SmsService,
    MailService,
  ],
})
export class PaymentModule {}
