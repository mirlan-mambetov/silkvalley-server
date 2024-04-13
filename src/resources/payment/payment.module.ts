import { StripeModule } from '@golevelup/nestjs-stripe'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
import { stripeConfig } from './config/stripe.config'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    UserService,
    AuthService,
    JwtService,
  ],
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => stripeConfig(configService),
    }),
  ],
})
export class PaymentModule {
  //
}
