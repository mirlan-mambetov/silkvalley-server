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

export class UserAddressDTO {
  @IsOptional()
  @IsString()
  amenity?: string

  @IsOptional()
  @IsString()
  road?: string

  @IsOptional()
  @IsString()
  city_district?: string

  @IsOptional()
  @IsString()
  postcode?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  country_code?: string

  @IsOptional()
  @IsString()
  houseNumber?: string
}
export class IGeocodeData {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  display_name: string

  @IsNotEmpty()
  @IsString()
  address: UserAddressDTO
}
export class IPlaceOrderDTO {
  @IsNotEmpty()
  @IsEnum(EnumPaymentMethod)
  paymentMethod: EnumPaymentMethod

  @IsNotEmpty()
  @IsArray()
  items: IOrderItems[]

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  totalCache: number

  @IsInt()
  @IsNumber()
  @IsOptional()
  totalDiscount?: number

  @IsNotEmpty()
  warhouse: IPointsDelivery

  @IsNotEmpty()
  userAddress: IGeocodeData

  @IsBoolean()
  @IsOptional()
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
