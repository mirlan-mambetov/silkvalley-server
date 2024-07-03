import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EnumPaymentMethod, EnumStatusOrder, Users } from '@prisma/client'
import { PaymentEnumStatus } from 'src/enums/Payment.enum'
import { ICardPayment } from 'src/interfaces/payment.interface'
import { PrismaService } from 'src/prisma.service'
import Stripe from 'stripe'
import { v4 as uuid } from 'uuid'
import { NotificationService } from '../notification/notification.service'
import { SmsService } from '../sms/sms.service'
import { UserService } from '../user/user.service'
import { StripePaymentIntentSucceededEvent } from './data-transfer/payment.dto'
import { IOrderProducts, IPlaceOrderDTO } from './data-transfer/place.order.dto'

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly notificationService: NotificationService,
    private readonly mailerService: MailerService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  /**
   *
   * @param data
   * @param userId
   */
  async updateStatus(data: StripePaymentIntentSucceededEvent, userId: number) {
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
          message: `Ваш заказ # ${order.orderId} Проведен успешно!.`,
          userId: updatedSuccess.userId,
          type: 'ORDER_UPDATE',
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
          message: `Ваш заказ # ${order.orderId} Проведен с ошибкой!.`,
          userId: updatedFiled.userId,
          type: 'ORDER_UPDATE',
        })
    }
  }

  /**
   *
   * @param dto
   * @param email
   * @returns
   */
  async placeOrder(dto: IPlaceOrderDTO, email: string) {
    const user = await this.userService.findOneByEmail(email)

    // CHANGED QUANTITY PRODUCTS
    await this.changeProductStock(dto.products)

    switch (dto.paymentMethod) {
      /**
       * PLACE ORDER WITH CACHE
       */
      case EnumPaymentMethod.CACHE:
        const order = await this.createOrder(user, dto)
        // await this.mailerService.sendMail({
        //   to: `${user.email}`, // list of receivers
        //   subject: 'Служба доставки', // Subject line
        //   text: 'Ваш заказ принят на обработку ✔', // plaintext body
        //   html: '<b>welcome</b>', // HTML body content
        // })
        const notify = await this.notificationService.create({
          message: `Ваш заказ ${order.orderId} принят на обработку! Метод оплаты наличными. Ожидайте`,
          type: 'ORDER_PLACE',
          userId: user.id,
        })

        return {
          message: notify.message,
          orderId: order.id,
          notifyId: notify.id,
        }

      /**
       * PLACE ORDER WITH CARD
       */
      case EnumPaymentMethod.CARD:
        const cardOrder = await this.createOrder(user, dto)
        const paymentWithCard = await this.placeOrderWithCard({
          order: cardOrder,
          products: dto.products,
        })
        const cardPaymentNotify = await this.notificationService.create({
          message: `Ваш заказ ${cardOrder.orderId} принят на обработку! Метод оплаты наличными. Ожидайте`,
          type: 'ORDER_PLACE',
          userId: user.id,
        })

        return {
          detail: paymentWithCard,
          message: notify.message,
          orderId: cardOrder.id,
          notifyId: cardPaymentNotify.id,
        }

      default:
        return {
          message: 'Не выбран метод оплаты',
        }
    }
  }

  /**
   *
   * @param products
   */
  async changeProductStock(products: IOrderProducts[]) {
    for await (const product of products) {
      const variant = await this.prismaService.productVariant.findUnique({
        where: { id: product.variant.id },
        select: { stock: true },
      })

      if (variant.stock < product.variant.stock) {
        throw new BadRequestException(`Ошибка. Данного товара нет в наличии`)
      }

      const newStock = variant.stock - product.variant.stock
      if (newStock < 0) {
        throw new Error(`Ошибка. Данного товара нет в наличии`)
      }

      await this.prismaService.productVariant.update({
        where: { id: product.variant.id },
        data: { stock: newStock },
      })
    }
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

    const lineItems = products.map((product) => ({
      quantity: product.quantityInCart,
      price_data: {
        product_data: {
          name: product.title,
          description: product.description,
          images: [`http://localhost:3000${product.poster}`],
        },
        currency: 'KGS',
        unit_amount: product.variant.price * 100,
      },
    }))

    const payment = await this.stripe.checkout.sessions.create({
      client_reference_id: `Order # ${order.id}`,
      line_items: lineItems,
      payment_method_types: ['card'],
      mode: 'payment',
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
  private async createOrder(user: Partial<Users>, dto: IPlaceOrderDTO) {
    const {
      address,
      paymentMethod,
      products,
      status,
      totalCache,
      // isCanceld,
      // totalDiscount,
    } = dto
    const ORDER_ID = uuid()
    const order = await this.prismaService.order.create({
      data: {
        items: {
          connect: products.map((product) => ({ id: product.variant.id })),
        },
        user: {
          connect: {
            id: Number(user.id),
          },
        },
        totalCache,
        status,
        orderId: ORDER_ID,
        payment_type: paymentMethod,
      },
    })

    await this.prismaService.orderAddress.create({
      data: {
        name: address.name,
        location: {
          create: {
            ...address.location,
          },
        },
        order: {
          connect: {
            id: Number(order.id),
          },
        },
      },
    })

    return order
  }

  /**
   *
   * @param sessionId
   */
  async cancelTransaction(sessionId: string) {
    // const logs = await this.stripe.checkout.sessions.list({ status: 'open' })
    // console.log(logs)
  }
}
