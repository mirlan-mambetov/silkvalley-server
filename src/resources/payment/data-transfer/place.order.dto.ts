import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class IPlaceOrderDTO {
  status: EnumStatusOrder

  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  products: IOrderProducts[]

  @IsNumber()
  totalPrice: number

  address: IPointsDelivery

  isCanceld?: boolean
}
export interface IGeo {
  lat: number
  lng: number
}

export class IPointsDelivery {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  location: IGeo
}

export class IOrderProducts {
  @IsNumber()
  id: number

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  productQuantity: number

  @IsNumber()
  price: number

  @IsString()
  poster: string

  @IsString()
  @IsOptional()
  selectedColor?: string

  @IsString()
  @IsOptional()
  selectedSize?: string
}
