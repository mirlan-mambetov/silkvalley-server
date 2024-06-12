import { EnumPaymentMethod, EnumStatusOrder, Users } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class IPlaceOrderDTO {
  @IsEnum(EnumStatusOrder)
  status: EnumStatusOrder

  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  products: IOrderProducts[]

  @IsNumber()
  totalPrice: number

  address: IPointsDelivery

  @IsBoolean()
  isCanceld?: boolean

  user: Pick<Users, 'email' | 'name' | 'phoneNumber'>
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
  quantityInCart: number

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
