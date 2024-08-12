import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { $Enums } from '@prisma/client'
import { IOrderItems } from '../payment/data-transfer/place.order.dto'

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  /**
   *
   * @param email
   * @param privateKey
   */
  sendRegisterEmail(email: string, privateKey: string) {
    this.mailService
      .sendMail({
        to: email,
        subject: 'Потдвердите E-mail',
        template: 'register',
        context: {
          email,
          privateKey,
        },
      })
      .then((res) => console.log(`RES SENDING MAIL ${res}`))
      .catch((err) => console.log(`CATCH SENDING MAIL ${err}`))
  }

  /**
   *
   * @param email
   * @param items
   */
  sendOrderDetail(
    email: string,
    data: {
      id: number
      createdAt: Date
      orderId: string
      status: $Enums.EnumStatusOrder
      totalCache: number
      payment_type: $Enums.EnumPaymentMethod
      items: IOrderItems[]
    },
  ) {
    const { createdAt, items, orderId, payment_type, status, totalCache } = data
    this.mailService
      .sendMail({
        to: email,
        subject: `Служба заказов Silk Valley`,
        template: 'placeorder',
        context: {
          email,
          order: {
            createdAt,
            items,
            orderId,
            payment_type,
            status,
            totalCache,
          },
        },
      })
      .then((res) => console.log(`PLACE ORDER SENDING EMAIL RESULT ${res}`))
      .catch((err) => console.log(`PLACE ORDER SENDING EMAIL ${err}`))
  }
}
