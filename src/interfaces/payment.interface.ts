import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { IOrderProducts } from 'src/resources/payment/data-transfer/place.order.dto'

export interface ICardPayment {
  order: IOrder
  products: IOrderProducts[]
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
