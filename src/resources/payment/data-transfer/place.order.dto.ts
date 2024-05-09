import { EnumPaymentMethod, EnumStatusOrder } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class IPlaceOrderDTO {
  status: EnumStatusOrder

  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  products: IOrderProducts[]

  @IsNumber()
  totalPrice: number

  address: PlaceOrderAddressDto

  isCanceld?: boolean
}

export class PlaceOrderAddressDto {
  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  road?: string

  @IsOptional()
  @IsString()
  house_number?: string

  @IsOptional()
  @IsString()
  postCode?: string

  @IsOptional()
  @IsString()
  country_code?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  city_district?: string

  @IsOptional()
  @IsString()
  village?: string

  @IsOptional()
  @IsString()
  town?: string
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
