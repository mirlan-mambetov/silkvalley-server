import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import Stripe from 'stripe'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/currentUser.decorator'
import { StripePaymentIntentSucceededEvent } from './data-transfer/payment.dto'
import { IPlaceOrderDTO } from './data-transfer/place.order.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Body() body: StripePaymentIntentSucceededEvent,
    @CurrentUser('id') userId: number,
  ) {
    return await this.paymentService.updateStatus(body, userId)
  }

  @Post('canceled-order')
  @HttpCode(HttpStatus.OK)
  async cancelTransaction(@Body() body: { sessionId: string }) {
    return await this.paymentService.cancelTransaction(body.sessionId)
  }

  @Post('place-order')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async placeOrder(
    @Body() dto: IPlaceOrderDTO,
    @CurrentUser('email') email: string,
  ) {
    return await this.paymentService.placeOrder(dto, email)
  }
}
