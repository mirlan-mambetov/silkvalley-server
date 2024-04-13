import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import { EnumStatusOrder } from '@prisma/client'
import { PaymentEnumStatus } from 'src/enums/Payment.enum'
import { PrismaService } from 'src/prisma.service'
import Stripe from 'stripe'
import { UserService } from '../user/user.service'
import { StripePaymentIntentSucceededEvent } from './data-transfer/payment.dto'
import { IPlaceOrderDTO } from './data-transfer/place.order.dto'

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  async payment(data: StripePaymentIntentSucceededEvent) {
    const part = data.data.object.description
    const parts = part.split('#')
    const orderId = parts[1].trim()
    const order = await this.prismaService.order.findUnique({
      where: { id: +orderId },
    })
    switch (data.type) {
      case PaymentEnumStatus.PAYMENT_INTENT_SUCCESS:
        await this.prismaService.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: EnumStatusOrder.PAYED,
          },
        })
      // case PaymentEnumStatus.PAYMENT_INTENT_CANCELED:
      //   await this.prismaService.order.update({
      //     where: {
      //       id: order.id,
      //     },
      //     data: {
      //       status: EnumStatusOrder.CANCELED,
      //     },
      //   })
    }
  }

  async placeOrder(
    dto: IPlaceOrderDTO,
    userId: number,
  ): Promise<Stripe.Response<Stripe.Checkout.Session> | undefined> {
    const user = await this.userService.findOneById(userId)

    const order = await this.prismaService.order.create({
      data: {
        items: {
          create: dto.products.map((product) => ({
            price: product.price,
            quantity: product.productQuantity,
            productId: product.id,
            name: product.title,
            color: product.selectedColor ? product.selectedColor : undefined,
            sizes: product.selectedSize ? product.selectedSize : undefined,
          })),
        },
        total: dto.totalPrice,
        status: dto.status,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    const payment = await this.stripe.checkout.sessions.create({
      client_reference_id: `Order # ${order.id}`,
      customer_email: user.email,
      line_items: dto.products.map((product) => {
        return {
          quantity: product.productQuantity,
          price_data: {
            product_data: {
              name: product.title,
              description: product.description,
              images: [
                `https://17ec-212-97-1-8.ngrok-free.app${product.poster}`,
              ],
              metadata: {
                size: product.selectedSize,
                color: product.selectedColor,
                order_id: order.id,
              },
            },
            currency: 'KGS',
            unit_amount: product.price * 100,
          },
        }
      }),
      payment_method_types: ['card'],
      mode: 'payment',
      // success_url: 'http://localhost:3000/cart',
      // cancel_url: 'http://localhost:3000',
      success_url: 'https://silk-valley-client.vercel.app/cart',
      cancel_url: 'https://silk-valley-client.vercel.app/cart',
      payment_intent_data: {
        description: `Order # ${order.id}`,
      },
    })

    return payment
  }
}
