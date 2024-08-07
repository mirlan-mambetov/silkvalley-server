import { EnumPaymentMethod } from '@prisma/client'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class IPointsDelivery {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  location: IGeo
}

export class IPlaceOrderDTO {
  @IsArray({ each: true })
  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  @IsNotEmpty()
  items: IOrderItems[]

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  totalCache: number

  @IsInt()
  @IsNumber()
  totalDiscount?: number

  @IsNotEmpty()
  address: IPointsDelivery

  @IsBoolean()
  isCanceld?: boolean
}

export interface IGeo {
  lat: number
  lng: number
}

export class IOrderItems {
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  variantId: number

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsInt()
  @IsNumber()
  quantity: number

  @IsString()
  poster: string

  @IsInt()
  @IsNumber()
  price: number
}
