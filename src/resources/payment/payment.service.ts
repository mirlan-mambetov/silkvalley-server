import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { PaymentEnumStatus } from 'src/enums/Payment.enum'
import { ICardPayment } from 'src/interfaces/payment.interface'
import { PrismaService } from 'src/prisma.service'
import Stripe from 'stripe'
import { v4 as uuid } from 'uuid'
import { MailService } from '../mail/mail.service'
import { NotificationService } from '../notification/notification.service'
import { SmsService } from '../sms/sms.service'
import { UserService } from '../user/user.service'
import { StripePaymentIntentSucceededEvent } from './data-transfer/payment.dto'
import { IPlaceOrderDTO } from './data-transfer/place.order.dto'

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  async payment(data: StripePaymentIntentSucceededEvent, userId: number) {
    console.log(data)
    console.log(data.data.object.description)

    const part = data.data.object.description
    const parts = part.split('#')
    const orderId = parts[1].trim()
    const order = await this.prismaService.order.findUnique({
      where: { id: +orderId },
    })

    switch (data.type) {
      case PaymentEnumStatus.PAYMENT_INTENT_SUCCESS:
        const updatedSuccess = await this.prismaService.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: EnumStatusOrder.PAYED,
          },
        })

        // CREATE NOTIFICATION OF ORDER FILED
        await this.notificationService.create({
          text: `Ваш заказ # ${order.orderId} Проведен успешно!.`,
          userId: updatedSuccess.userId,
          typeOfNotification: 'ORDER',
        })
        break

      case PaymentEnumStatus.PAYMENT_INTENT_CLOSED:
        const updatedFiled = await this.prismaService.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: EnumStatusOrder.CANCELED,
          },
        })
        // CREATE NOTIFICATION OF ORDER FILED
        await this.notificationService.create({
          text: `Ваш заказ # ${order.orderId} Проведен с ошибкой!.`,
          userId: updatedFiled.userId,
          typeOfNotification: 'ORDER',
        })
    }
  }

  async placeOrder(dto: IPlaceOrderDTO, email: string) {
    // FIND USER
    const user = await this.userService.findOneByEmail(email)
    // CREATE ORDER

    switch (dto.paymentMethod) {
      case EnumPaymentMethod.CACHE:
        const cacheOrder = await this.createOrder(user.id, dto)
        // CREATE NOTIFICATION OF ORDER FILED
        const cacheNotify = await this.notificationService.create({
          text: `Ваш заказ # ${cacheOrder.orderId} Проведен успешно!.`,
          userId: cacheOrder.userId,
          typeOfNotification: 'ORDER',
        })

        this.mailService.sendEmail(
          user.email,
          user.name,
          `Заказ ${cacheOrder.orderId} принят на обработку! Метод оплаты наличными. Ожидайте.`,
        )
        // await this.smsService.sendSms(
        //   `996${user.phoneNumber}`,
        //   `Заказ ${cacheOrder.id} принят на обработку! Метод оплаты наличными. Ожидайте.`,
        // )
        // RETURN ORDER INFORMATION
        return {
          message: `Заказ ${cacheOrder.orderId} принят на обработку! Метод оплаты наличными. Ожидайте.`,
          orderId: cacheOrder.id,
          notifyId: cacheNotify.id,
        }

      case EnumPaymentMethod.CARD:
        const cardOrder = await this.createOrder(user.id, dto)
        const paymentWithCard = await this.placeOrderWithCard({
          order: cardOrder,
          products: dto.products,
        })

        const cardNotify = await this.notificationService.create({
          text: `Ваш заказ # ${cardOrder.orderId} Проведен успешно!.`,
          userId: cardOrder.userId,
          typeOfNotification: 'ORDER',
        })

        return {
          detail_order: paymentWithCard,
          orderId: cardOrder.id,
          notifyId: cardNotify.id,
        }
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
        payment_type: dto.paymentMethod,
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
        name: dto.address.name,
        order: {
          connect: {
            id: order.id,
          },
        },
      },
    })

    await this.prismaService.location.create({
      data: {
        orderId: order.id,
        ...dto.address.location,
      },
    })
    return order
  }
}
