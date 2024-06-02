import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { PaymentEnumStatus } from 'src/enums/Payment.enum'
import { ICardPayment } from 'src/interfaces/payment.interface'
import { PrismaService } from 'src/prisma.service'
import Stripe from 'stripe'
import { v4 as uuid } from 'uuid'
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
    console.log(data.data.object.description)
    switch (data.type) {
      case PaymentEnumStatus.PAYMENT_INTENT_SUCCESS:
        const part = data.data.object.description
        const parts = part.split('#')
        const orderId = parts[1].trim()
        const order = await this.prismaService.order.findUnique({
          where: { id: +orderId },
        })
        await this.prismaService.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: EnumStatusOrder.PAYED,
          },
        })
      // case PaymentEnumStatus.PAYMENT_INTENT_CLOSED:
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

  async placeOrder(dto: IPlaceOrderDTO, email: string) {
    // FIND USER
    const user = await this.userService.findOneByEmail(email)
    // CREATE ORDER

    switch (dto.paymentMethod) {
      case 'CACHE':
        const orderWithCache = await this.createOrder(user.id, dto)
        return {
          message: `Заказ ${orderWithCache.id} принят на обработку! Метод оплаты наличными. Ожидайте.`,
        }
      case 'CARD':
        const orderWithCard = await this.createOrder(user.id, dto)
        const paymentWithCard = await this.placeOrderWithCard({
          order: orderWithCard,
          products: dto.products,
        })
        return paymentWithCard
      default:
        return {
          message: 'Не выбран метод оплаты',
        }
    }
  }

  async cancelTransaction(sessionId: string) {
    const logs = await this.stripe.checkout.sessions.list({ status: 'open' })
    console.log(logs)
  }

  /**
   *
   * @param data
   * @returns
   * @description Place order with cards (Visa, MasterCard....)
   */
  private async placeOrderWithCard(
    data: ICardPayment,
  ): Promise<Stripe.Response<Stripe.Checkout.Session> | undefined> {
    const { order, products } = data
    const payment = await this.stripe.checkout.sessions.create({
      client_reference_id: `Order # ${order.id}`,
      line_items: products.map((product) => {
        return {
          quantity: product.productQuantity,
          price_data: {
            product_data: {
              name: product.title,
              description: product.description,
              images: [`http://api.slkvalley.com${product.poster}`],
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
      success_url: 'https://slkvalley.com',
      cancel_url: 'https://slkvalley.com',
      payment_intent_data: {
        description: `Order # ${order.id}`,
      },
    })
    return payment
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  private async createOrder(userId: number, dto: IPlaceOrderDTO) {
    const ORDER_ID = uuid()
    const order = await this.prismaService.order.create({
      data: {
        payment_type: EnumPaymentMethod.CARD,
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
        totalCache: dto.totalPrice,
        status: dto.status,
        orderId: ORDER_ID,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    // INSERT ORDER ADDRESS
    await this.prismaService.orderAddress.create({
      data: {
        city: dto.address.city,
        road: dto.address.road,
        houseNumber: dto.address.house_number,
        postCode: dto.address.postCode,
        countryCode: dto.address.country_code,
        country: dto.address.country,
        state: dto.address.state,
        cityDistrict: dto.address.city_district,
        village: dto.address.village,
        town: dto.address.town,
        order: {
          connect: {
            id: order.id,
          },
        },
      },
    })
    return order
  }
}
