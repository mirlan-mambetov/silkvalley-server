import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { IOrderItems } from 'src/resources/payment/data-transfer/place.order.dto'

export interface ICardPayment {
  order: IOrder
  products: IOrderItems[]
}
export interface IOrder {
  id: number
  createdAt: Date
  updatedAt: Date
  status: EnumStatusOrder
  totalCache: number
  payment_type: EnumPaymentMethod
  userId: number
}
