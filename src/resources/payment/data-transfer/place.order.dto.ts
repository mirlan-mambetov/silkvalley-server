import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
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
  @IsEnum(EnumStatusOrder)
  status: EnumStatusOrder

  @IsArray({ each: true })
  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  @IsNotEmpty()
  products: IOrderProducts[]

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

export class ProductVariantDTO {
  price: number
  size: string
  articleNumber: string
  stock: number
  productId: number
  discount: number
  id: number
}
export class IOrderProducts {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsInt()
  @IsNumber()
  quantityInCart: number

  @IsString()
  poster: string

  @IsNotEmpty()
  variant: ProductVariantDTO
}
