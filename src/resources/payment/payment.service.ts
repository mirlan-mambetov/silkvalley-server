import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { EnumPaymentMethod, EnumStatusOrder, Users } from '@prisma/client'
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
import { IOrderItems, IPlaceOrderDTO } from './data-transfer/place.order.dto'

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
    // private readonly mailerService: MailerService,
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
    try {
      const user = await this.userService.findOneByEmail(email)

      // CHANGED QUANTITY PRODUCTS
      await this.changeProductStock(dto.items)

      switch (dto.paymentMethod) {
        /**
         * PLACE ORDER WITH CACHE
         */
        case EnumPaymentMethod.CACHE:
          const order = await this.createOrder(user, dto)
          this.mailService.sendOrderDetail(user.email, {
            ...order,
            items: dto.items,
          })

          const notify = await this.notificationService.create({
            message: `Ваш заказ принят на обработку! Проверьте ваш почтовый ящик для доп.информации`,
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
            products: dto.items,
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
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param products
   */
  async changeProductStock(variants: IOrderItems[]) {
    for await (const variant of variants) {
      const findedVariant = await this.prismaService.productVariant.findUnique({
        where: { id: variant.variantId },
        select: { stock: true },
      })
      if (findedVariant.stock < variant.quantity) {
        throw new BadRequestException(`Ошибка. Данного товара нет в наличии`)
      }
      await this.prismaService.productVariant.update({
        where: { id: variant.variantId },
        data: {
          stock: {
            decrement: variant.quantity,
          },
        },
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

    const lineItems = products.map((variant) => ({
      quantity: variant.quantity,
      price_data: {
        product_data: {
          name: variant.title,
          description: variant.description,
          images: [`${process.env.API_HOST}${variant.poster}`],
        },
        currency: 'KGS',
        unit_amount: variant.price * 100,
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
    try {
      const {
        warhouse,
        paymentMethod,
        items,
        totalCache,
        // isCanceld,
        // totalDiscount,
      } = dto
      const ORDER_ID = uuid()
      const order = await this.prismaService.order.create({
        data: {
          items: {
            create: items.map((variant) => ({
              productVariantId: variant.variantId,
              quantity: variant.quantity,
              price: variant.price,
            })),
          },
          user: {
            connect: {
              id: Number(user.id),
            },
          },
          warehouse: {
            create: {
              name: warhouse.name,
              location: {
                create: {
                  lat: warhouse.location.lat,
                  lng: warhouse.location.lng,
                },
              },
            },
          },
          totalCache,
          status: EnumStatusOrder.WAITING,
          orderId: ORDER_ID,
          payment_type: paymentMethod,
        },
      })

      /**
       * После того как будет реализовано поис данных с формы добавления адреса пользователя на карте здесь в location записать lat,lng
       */
      await this.prismaService.orderAddress.create({
        data: {
          name: dto.userAddress.name,
          location: {
            create: {
              lat: 2,
              lng: 2,
            },
          },
          userAddress: {
            create: {
              city: dto.userAddress.address.city,
              houseNumber: dto.userAddress.address.houseNumber,
              road: dto.userAddress.address.road,
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
    } catch (error) {
      throw new Error(error)
    }
  }

  // /**
  //  *
  //  * @param sessionId
  //  */
  // async cancelTransaction(sessionId: string) {
  //   // const logs = await this.stripe.checkout.sessions.list({ status: 'open' })
  //   // console.log(logs)
  // }
}
